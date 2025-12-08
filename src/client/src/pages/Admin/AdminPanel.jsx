import React from 'react';
import './AdminPanel.css';

export default function AdminPanel() {
    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1>Panel de Administración</h1>
                <p>Bienvenido, Admin</p>
            </header>

            <div className="admin-content">
                <div className="admin-card">
                    <h2>Productos</h2>
                    <p>Gestión del catálogo de productos</p>
                    <button className="admin-btn" onClick={() => window.location.href = '/admin/products'}>Ver Productos</button>
                </div>

                <div className="admin-card">
                    <h2>Reservas</h2>
                    <p>Gestión de reservas y citas</p>
                    <button className="admin-btn" onClick={() => window.location.href = '/admin/reservations'}>Ver Reservas</button>
                </div>

                <div className="admin-card">
                    <h2>Usuarios</h2>
                    <p>Gestión de roles y cuentas</p>
                    <button className="admin-btn" onClick={() => window.location.href = '/admin/users'}
                    >Ver Usuarios</button>
                </div>

                <div className="admin-card">
                    <h2>Chat Soporte</h2>
                    <p>Atención al cliente en tiempo real</p>
                    <button className="admin-btn" onClick={() => window.location.href = '/admin/chat'}>Ir al Chat</button>
                </div>
            </div>
        </div>
    );
}
