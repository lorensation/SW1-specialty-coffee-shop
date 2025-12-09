import React, { useState, useEffect } from 'react';
import { Shield, Ban, CheckCircle, User as UserIcon } from 'lucide-react';
import userService from '../../services/userService';
import ConfirmModal from '../../components/ConfirmModal';
import './AdminUsers.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: ''
    });
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers(filters);
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const roleText = newRole === 'admin' ? 'administrador' : 'usuario básico';
        
        setModalConfig({
            isOpen: true,
            title: 'Cambiar rol de usuario',
            message: `¿Estás seguro de cambiar el rol de este usuario a ${roleText}?`,
            onConfirm: async () => {
                try {
                    const response = await userService.updateUserRole(id, newRole);
                    if (response.success) {
                        fetchUsers();
                    }
                } catch (error) {
                    console.error('Error updating role:', error);
                    alert('Error al actualizar el rol');
                }
                closeModal();
            }
        });
    };

    const handleStatusChange = async (id, isActive) => {
        const action = isActive ? 'suspender' : 'activar';
        
        setModalConfig({
            isOpen: true,
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} usuario`,
            message: `¿Estás seguro de ${action} a este usuario?`,
            onConfirm: async () => {
                try {
                    const response = await userService.updateUserStatus(id, !isActive);
                    if (response.success) {
                        fetchUsers();
                    }
                } catch (error) {
                    console.error('Error updating status:', error);
                    alert('Error al actualizar el estado');
                }
                closeModal();
            }
        });
    };

    const closeModal = () => {
        setModalConfig({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="admin-users">
            <div className="users-header">
                <h2>Gestión de Usuarios</h2>
                <button className="action-btn promote" onClick={fetchUsers}>
                    Actualizar Lista
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label>Rol:</label>
                    <select
                        name="role"
                        className="filter-input"
                        value={filters.role}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos</option>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="users-table-container">
                {loading ? (
                    <div className="loading-spinner">Cargando usuarios...</div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <span style={{ fontWeight: 500 }}>{user.name}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${user.role}`}>
                                                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.is_active ? 'active' : 'suspended'}`}>
                                                {user.is_active ? 'Activo' : 'Suspendido'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className={`action-btn ${user.role === 'admin' ? 'demote' : 'promote'}`}
                                                    onClick={() => handleRoleChange(user.id, user.role)}
                                                    title={user.role === 'admin' ? 'Degradar a Usuario' : 'Promover a Admin'}
                                                >
                                                    {user.role === 'admin' ? <UserIcon size={18} /> : <Shield size={18} />}
                                                </button>

                                                <button
                                                    className={`action-btn ${user.is_active ? 'suspend' : 'activate'}`}
                                                    onClick={() => handleStatusChange(user.id, user.is_active)}
                                                    title={user.is_active ? 'Suspender Cuenta' : 'Activar Cuenta'}
                                                >
                                                    {user.is_active ? <Ban size={18} /> : <CheckCircle size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />
        </div>
    );
}
