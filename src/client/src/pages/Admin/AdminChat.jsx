import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './AdminChat.css';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

export default function AdminChat() {
    const [socket, setSocket] = useState(null);
    const [activeChats, setActiveChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState({}); // { userId: [messages] }
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Admin connected to socket server');
            newSocket.emit('join_admin');
        });

        newSocket.on('user_joined', (userData) => {
            setActiveChats((prev) => {
                if (prev.find((c) => c.id === userData.id)) return prev;
                return [...prev, userData];
            });
        });

        newSocket.on('active_chats', (chats) => {
            setActiveChats((prev) => {
                // Merge existing active chats (real-time) with historical ones
                const newChats = [...prev];
                chats.forEach(chat => {
                    if (!newChats.find(c => c.id === chat.id)) {
                        newChats.push(chat);
                    }
                });
                return newChats;
            });
        });

        newSocket.on('receive_message', (data) => {
            const { senderId, senderName, message, timestamp } = data;

            // Add user to active chats if not exists
            setActiveChats((prev) => {
                if (prev.find((c) => c.id === senderId)) return prev;
                return [...prev, { id: senderId, name: senderName }];
            });

            // Add message
            setMessages((prev) => ({
                ...prev,
                [senderId]: [...(prev[senderId] || []), data],
            }));
        });

        newSocket.on('chat_history', ({ userId, messages: history }) => {
            const formattedMessages = history.map(msg => ({
                message: msg.message,
                senderId: msg.sender === 'admin' ? 'admin' : userId,
                senderName: msg.sender === 'admin' ? 'Admin' : 'User',
                timestamp: msg.created_at,
                isSelf: msg.sender === 'admin'
            }));

            setMessages(prev => ({
                ...prev,
                [userId]: formattedMessages
            }));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedChatId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedChatId || !socket) return;

        const messageData = {
            userId: selectedChatId,
            message: input,
        };

        // Optimistic update
        const newMessage = {
            senderId: 'admin',
            senderName: 'Admin',
            message: input,
            timestamp: new Date(),
            isSelf: true,
        };

        setMessages((prev) => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
        }));

        socket.emit('send_message_to_user', messageData);
        setInput('');
    };

    const selectedChatMessages = selectedChatId ? messages[selectedChatId] || [] : [];

    return (
        <div className="admin-chat-container">
            <div className="chat-sidebar">
                <h3>Chats Activos</h3>
                <div className="chat-list">
                    {activeChats.length === 0 && <p className="no-chats">No hay chats activos</p>}
                    {activeChats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedChatId(chat.id);
                                if (socket) socket.emit('get_user_history', chat.id);
                            }}
                        >
                            <div className="chat-avatar">{chat.name[0].toUpperCase()}</div>
                            <div className="chat-info">
                                <span className="chat-name">{chat.name}</span>
                                <span className="chat-id">ID: {chat.id.slice(0, 6)}...</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-main">
                {selectedChatId ? (
                    <>
                        <div className="chat-main-header">
                            <h3>Chat con {activeChats.find(c => c.id === selectedChatId)?.name}</h3>
                        </div>
                        <div className="chat-main-messages">
                            {selectedChatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.isSelf ? 'self' : 'user'}`}
                                >
                                    <div className="message-content">{msg.message}</div>
                                    <div className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="chat-input-form" onSubmit={sendMessage}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe un mensaje..."
                            />
                            <button type="submit">Enviar</button>
                        </form>
                    </>
                ) : (
                    <div className="chat-placeholder">
                        <p>Selecciona un chat para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
