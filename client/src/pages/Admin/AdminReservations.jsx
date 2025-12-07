import React, { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';
import {
    Calendar,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    Edit2,
    Trash2,
    Check
} from 'lucide-react';
import './AdminReservations.css';

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        date: '',
        search: '' // Added search
    });
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0
    });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [rescheduleData, setRescheduleData] = useState({
        reservation_date: '',
        reservation_time: ''
    });

    useEffect(() => {
        fetchReservations();
    }, [filters.status, filters.date]); // Search is handled client-side for now or needs API update

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await reservationService.getAllReservations({
                status: filters.status,
                date: filters.date
            });
            if (response.success) {
                setReservations(response.data);
                calculateStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const newStats = {
            total: data.length,
            pending: data.filter(r => r.status === 'pending').length,
            confirmed: data.filter(r => r.status === 'confirmed').length,
            cancelled: data.filter(r => r.status === 'cancelled').length
        };
        setStats(newStats);
    };

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;

        try {
            const response = await reservationService.updateReservationStatus(id, newStatus);
            if (response.success) {
                fetchReservations(); // Refresh list
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        }
    };

    const openRescheduleModal = (reservation) => {
        setSelectedReservation(reservation);
        setRescheduleData({
            reservation_date: reservation.reservation_date.split('T')[0],
            reservation_time: reservation.reservation_time
        });
        setShowModal(true);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await reservationService.updateReservation(selectedReservation.id, rescheduleData);
            if (response.success) {
                setShowModal(false);
                fetchReservations();
                alert('Reserva reprogramada correctamente');
            }
        } catch (error) {
            console.error('Error rescheduling:', error);
            alert('Error al reprogramar la reserva');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Client-side search filtering
    const filteredReservations = reservations.filter(res => {
        if (!filters.search) return true;
        const searchLower = filters.search.toLowerCase();
        const clientName = (res.user?.name || res.guest_name || '').toLowerCase();
        const clientEmail = (res.user?.email || res.guest_email || '').toLowerCase();
        return clientName.includes(searchLower) || clientEmail.includes(searchLower);
    });

    return (
        <div className="admin-reservations">
            <header className="page-header">
                <div>
                    <h2 className="page-title">Gestión de Reservas</h2>
                    <p className="page-subtitle">Administra y supervisa todas las reservas del local</p>
                </div>
                <button className="btn-refresh" onClick={fetchReservations} title="Actualizar datos">
                    <RefreshCw size={20} />
                </button>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Reservas</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-icon pending">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Pendientes</span>
                        <span className="stat-value">{stats.pending}</span>
                    </div>
                </div>
                <div className="stat-card confirmed">
                    <div className="stat-icon confirmed">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Confirmadas</span>
                        <span className="stat-value">{stats.confirmed}</span>
                    </div>
                </div>
                <div className="stat-card cancelled">
                    <div className="stat-icon cancelled">
                        <XCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Canceladas</span>
                        <span className="stat-value">{stats.cancelled}</span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Buscar por cliente o email..."
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filters-group">
                    <div className="filter-item">
                        <Filter size={16} />
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="cancelled">Cancelada</option>
                            <option value="completed">Completada</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <Calendar size={16} />
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando reservas...</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Fecha y Hora</th>
                                <th>Personas</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        No se encontraron reservas que coincidan con los filtros.
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map(res => (
                                    <tr key={res.id}>
                                        <td>
                                            <div className="client-cell">
                                                <div className="client-avatar">
                                                    {(res.user?.name || res.guest_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="client-info">
                                                    <span className="client-name">{res.user?.name || res.guest_name || 'Invitado'}</span>
                                                    <span className="client-email">{res.user?.email || res.guest_email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="datetime-cell">
                                                <span className="date">{new Date(res.reservation_date).toLocaleDateString()}</span>
                                                <span className="time">{res.reservation_time.slice(0, 5)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="people-cell">
                                                <Users size={16} />
                                                <span>{res.num_people}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${res.status}`}>
                                                <span className="status-dot"></span>
                                                {res.status === 'confirmed' ? 'Confirmada' :
                                                    res.status === 'pending' ? 'Pendiente' :
                                                        res.status === 'cancelled' ? 'Cancelada' : 'Completada'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                {res.status === 'pending' && (
                                                    <button
                                                        className="icon-btn success"
                                                        onClick={() => handleStatusChange(res.id, 'confirmed')}
                                                        title="Confirmar"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {res.status !== 'cancelled' && (
                                                    <>
                                                        <button
                                                            className="icon-btn primary"
                                                            onClick={() => openRescheduleModal(res)}
                                                            title="Reprogramar"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            className="icon-btn danger"
                                                            onClick={() => handleStatusChange(res.id, 'cancelled')}
                                                            title="Cancelar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Reschedule Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Reprogramar Reserva</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleRescheduleSubmit} className="reschedule-form">
                            <div className="form-group">
                                <label>Nueva Fecha</label>
                                <input
                                    type="date"
                                    required
                                    value={rescheduleData.reservation_date}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, reservation_date: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nueva Hora</label>
                                <select
                                    required
                                    value={rescheduleData.reservation_time}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, reservation_time: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="">Selecciona hora</option>
                                    {['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'].map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-save">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
