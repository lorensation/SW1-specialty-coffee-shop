import { Server } from 'socket.io';
import Message from '../models/Message.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Client URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join a room based on user ID if authenticated, or socket ID for guests
        socket.on('join_chat', async (userData) => {
            const roomId = userData?.id || socket.id;
            socket.join(roomId);
            socket.userData = userData || { name: 'Guest', id: socket.id };

            console.log(`User ${socket.userData.name} joined room ${roomId}`);

            // Notify admin of new/active chat
            io.to('admin').emit('user_joined', {
                id: roomId,
                name: socket.userData.name,
                socketId: socket.id
            });

            // Load history if it's a registered user
            if (userData?.id) {
                const history = await Message.getHistory(userData.id);
                if (history.success) {
                    socket.emit('chat_history', history.data);
                }
            }
        });

        // Admin joins the 'admin' room
        socket.on('join_admin', async () => {
            socket.join('admin');
            console.log('Admin joined admin room');

            // Send list of active chats (users with history)
            const activeChats = await Message.getActiveChats();
            if (activeChats.success) {
                socket.emit('active_chats', activeChats.data);
            }
        });

        // Admin requests user history
        socket.on('get_user_history', async (userId) => {
            const history = await Message.getHistory(userId);
            if (history.success) {
                socket.emit('chat_history', { userId, messages: history.data });
            }
        });

        // User sends message to Admin
        socket.on('send_message_to_admin', async (data) => {
            const { message } = data;
            const roomId = socket.userData?.id || socket.id;
            const isRegistered = !!socket.userData?.id && socket.userData.id !== socket.id;

            console.log(`Message from ${socket.userData?.name}: ${message}`);

            // Save to DB if registered
            if (isRegistered) {
                await Message.create({
                    user_id: roomId,
                    sender: 'user',
                    message
                });
            }

            io.to('admin').emit('receive_message', {
                senderId: roomId,
                senderName: socket.userData?.name || 'Guest',
                message,
                timestamp: new Date()
            });
        });

        // Admin sends message to User
        socket.on('send_message_to_user', async (data) => {
            const { userId, message } = data;
            console.log(`Admin sending to ${userId}: ${message}`);

            // Save to DB (assuming userId is a valid UUID for registered user)
            // If userId is a socketID (guest), it won't be a valid UUID, so DB insert might fail or we skip
            // Simple check: UUID length is 36
            if (userId.length === 36) {
                await Message.create({
                    user_id: userId,
                    sender: 'admin',
                    message
                });
            }

            io.to(userId).emit('receive_message', {
                senderId: 'admin',
                senderName: 'Admin',
                message,
                timestamp: new Date()
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
