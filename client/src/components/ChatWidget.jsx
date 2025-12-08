import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import './ChatWidget.css';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

export default function ChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && !socket) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                if (user) {
                    newSocket.emit('join_chat', { id: user.id, name: user.name });
                } else {
                    newSocket.emit('join_chat', null); // Guest
                }
            });

            newSocket.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            newSocket.on('chat_history', (history) => {
                const formattedMessages = history.map(msg => ({
                    message: msg.message,
                    senderId: msg.sender === 'user' ? (user?.id || 'guest') : 'admin',
                    senderName: msg.sender === 'user' ? (user?.name || 'Guest') : 'Admin',
                    timestamp: msg.created_at,
                    isSelf: msg.sender === 'user'
                }));
                setMessages(formattedMessages);
            });

            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        }
    }, [isOpen, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Do not show chat widget for admins
    if (user?.role === 'admin') return null;

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socket) return;

        const messageData = {
            message: input,
            senderId: user?.id || socket.id,
            senderName: user?.name || 'Guest',
            timestamp: new Date(),
        };

        // Optimistic update
        setMessages((prev) => [...prev, { ...messageData, isSelf: true }]);

        socket.emit('send_message_to_admin', { message: input });
        setInput('');
    };

    return (
        <div className="chat-widget-container">
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    💬 Chat
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Atención al Cliente</h3>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <p className="chat-welcome">¡Hola! ¿En qué podemos ayudarte?</p>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.isSelf ? 'self' : 'admin'}`}
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
                        <button type="submit">➤</button>
                    </form>
                </div>
            )}
        </div>
    );
}
