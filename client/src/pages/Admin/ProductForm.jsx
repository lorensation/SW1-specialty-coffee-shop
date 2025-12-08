import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './ProductForm.css';

export default function ProductForm({ product, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'origen',
        image_url: '',
        stock_quantity: 0,
        is_featured: false,
        is_active: true
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                category: product.category,
                image_url: product.image_url || '',
                stock_quantity: product.stock_quantity || 0,
                is_featured: product.is_featured || false,
                is_active: product.is_active ?? true
            });
            setPreviewUrl(product.image_url || '');
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = formData.image_url;

            if (selectedFile) {
                const uploadResponse = await productService.uploadImage(selectedFile);
                if (uploadResponse.success) {
                    imageUrl = uploadResponse.url;
                }
            }

            const productData = { ...formData, image_url: imageUrl };

            if (product) {
                await productService.updateProduct(product.id, productData);
            } else {
                await productService.createProduct(productData);
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Precio (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="origen">Café de Origen</option>
                            <option value="bebida">Bebida Preparada</option>
                            <option value="postres">Postres</option>
                            <option value="ediciones">Ediciones Limitadas</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {previewUrl && (
                            <div className="image-preview">
                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px', borderRadius: '4px' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-row checkbox-row">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                            />
                            Destacado
                        </label>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            Activo
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={uploading}>Cancelar</button>
                        <button type="submit" className="save-btn" disabled={uploading}>
                            {uploading ? 'Subiendo...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
