import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductForm from './ProductForm';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    RefreshCw,
    Tag,
    DollarSign,
    Box,
    Image as ImageIcon
} from 'lucide-react';
import './AdminProducts.css';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAllProducts({ limit: 100 }); // Get all for now
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await productService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            await productService.updateProduct(product.id, { is_active: !product.is_active });
            fetchProducts();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        }
    };

    const handleFormSubmit = async () => {
        setIsFormOpen(false);
        fetchProducts();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Client-side filtering
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category ? product.category === filters.category : true;
        return matchesSearch && matchesCategory;
    });

    // Stats
    const stats = {
        total: products.length,
        active: products.filter(p => p.is_active).length,
        lowStock: products.filter(p => p.stock_quantity < 10).length
    };

    return (
        <div className="admin-products">
            <header className="page-header">
                <div>
                    <h2 className="page-title">Gestión de Productos</h2>
                    <p className="page-subtitle">Administra el inventario, precios y disponibilidad</p>
                </div>
                <div className="header-actions">
                    <button className="btn-refresh" onClick={fetchProducts} title="Actualizar datos">
                        <RefreshCw size={20} />
                    </button>
                    <button className="btn-primary" onClick={handleCreate}>
                        <Plus size={20} />
                        <span>Nuevo Producto</span>
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Productos</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="stat-card active">
                    <div className="stat-icon active">
                        <Eye size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Activos</span>
                        <span className="stat-value">{stats.active}</span>
                    </div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-icon warning">
                        <AlertCircleIcon size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Bajo Stock</span>
                        <span className="stat-value">{stats.lowStock}</span>
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
                        placeholder="Buscar producto..."
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filters-group">
                    <div className="filter-item">
                        <Filter size={16} />
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todas las categorías</option>
                            <option value="cafe">Café</option>
                            <option value="postres">Postres</option>
                            <option value="accesorios">Accesorios</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className={!product.is_active ? 'row-inactive' : ''}>
                                        <td>
                                            <div className="product-cell">
                                                <div className="product-img-wrapper">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="product-img" />
                                                    ) : (
                                                        <ImageIcon size={20} className="product-placeholder" />
                                                    )}
                                                </div>
                                                <span className="product-name">{product.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="category-badge">
                                                <Tag size={14} />
                                                <span>{product.category}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="price-cell">
                                                <span className="price-value">{product.price}€</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`stock-badge ${product.stock_quantity < 10 ? 'low' : 'good'}`}>
                                                <Box size={14} />
                                                <span>{product.stock_quantity}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                                                <span className="status-dot"></span>
                                                {product.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="icon-btn primary"
                                                    onClick={() => handleEdit(product)}
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className={`icon-btn ${product.is_active ? 'warning' : 'success'}`}
                                                    onClick={() => handleToggleStatus(product)}
                                                    title={product.is_active ? 'Desactivar' : 'Activar'}
                                                >
                                                    {product.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button
                                                    className="icon-btn danger"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
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

            {isFormOpen && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}

// Helper component for the missing icon
function AlertCircleIcon({ size, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    );
}
