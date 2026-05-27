import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api/productApi';
import { uploadImage } from '../api/productApi';

const ProductForm = ({ onClose, onSuccess, editProduct }) => {

    const [imagePreview, setImagePreview] = useState(
        editProduct?.imageUrl || null
    );
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview instantly
        setImagePreview(URL.createObjectURL(file));

        // Upload to backend
        setUploading(true);
        try {
            const data = await uploadImage(file);
            setFormData({ ...formData, imageUrl: data.imageUrl });
        } catch (error) {
            setErrors({ ...errors, imageUrl: 'Image upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        category: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // If editing — prefill the form
    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || '',
                description: editProduct.description || '',
                price: editProduct.price || '',
                stock: editProduct.stock || '',
                imageUrl: editProduct.imageUrl || '',
                category: editProduct.category || ''
            });
        }
    }, [editProduct]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        else if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.stock) newErrors.stock = 'Stock is required';
        else if (formData.stock <= 0) newErrors.stock = 'Stock must be greater than 0';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            if (editProduct) {
                await updateProduct(editProduct.id, formData);
            } else {
                await createProduct(formData);
            }
            onSuccess();
        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>
                        {editProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {errors.general && (
                    <div style={styles.errorBox}>{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Product Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="iPhone 15"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.name ? '#e53e3e' : '#e2e8f0'
                                }}
                            />
                            {errors.name && <span style={styles.error}>{errors.name}</span>}
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Category</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Electronics"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Product description..."
                            rows={3}
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Price (Rs.)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="999.99"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.price ? '#e53e3e' : '#e2e8f0'
                                }}
                            />
                            {errors.price && <span style={styles.error}>{errors.price}</span>}
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Stock</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="50"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.stock ? '#e53e3e' : '#e2e8f0'
                                }}
                            />
                            {errors.stock && <span style={styles.error}>{errors.stock}</span>}
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Product Image</label>

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'contain',
                                    backgroundColor: '#f7fafc',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    padding: '8px',
                                }}
                            />
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.fileInput}
                        />

                        {uploading && (
                            <span style={{ fontSize: '12px', color: '#718096' }}>
                                Uploading image...
                            </span>
                        )}

                        {errors.imageUrl && (
                            <span style={styles.error}>{errors.imageUrl}</span>
                        )}
                    </div>

                    <div style={styles.modalFooter}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading
                                ? 'Saving...'
                                : editProduct ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a202c',
        margin: 0,
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: '#718096',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#4a5568',
    },
    input: {
        padding: '10px 14px',
        fontSize: '14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        color: '#1a202c',
    },
    textarea: {
        padding: '10px 14px',
        fontSize: '14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        color: '#1a202c',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    error: {
        fontSize: '12px',
        color: '#e53e3e',
    },
    errorBox: {
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        color: '#c53030',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '8px',
    },
    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        backgroundColor: '#ffffff',
        color: '#4a5568',
        cursor: 'pointer',
        fontWeight: '500',
    },
    submitBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        cursor: 'pointer',
        fontWeight: '500',
    },
    fileInput: {
        padding: '8px',
        fontSize: '13px',
        border: '1.5px dashed #e2e8f0',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#f7fafc',
    },
};

export default ProductForm;
