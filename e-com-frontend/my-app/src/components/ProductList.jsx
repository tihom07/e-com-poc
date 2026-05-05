import { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct, searchProducts } from '../api/productApi';
import ProductForm from './ProductForm';

const ProductList = ({ onViewDetail }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            setMessage('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            fetchProducts();
        } else {
            const results = await searchProducts(query);
            setProducts(results);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setMessage('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            setMessage('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditProduct(null);
        setMessage(editProduct ? 'Product updated!' : 'Product added!');
        fetchProducts();
    };

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <h2 style={styles.title}>Products</h2>
                <button
                    onClick={() => { setEditProduct(null); setShowForm(true); }}
                    style={styles.addBtn}
                >
                    + Add Product
                </button>
            </div>

            {message && (
                <div style={styles.message}>{message}</div>
            )}

            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                style={styles.searchInput}
            />

            {loading ? (
                <p style={styles.loadingText}>Loading products...</p>
            ) : products.length === 0 ? (
                <p style={styles.emptyText}>No products found. Add your first product!</p>
            ) : (
                <div style={styles.grid}>
                    {products.map(product => (
                        <div key={product.id} style={styles.card} onClick={() => onViewDetail(product.id)}>

                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    style={styles.image}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}

                            <div style={styles.cardBody}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.category}>{product.category}</span>
                                    <span style={styles.price}>${product.price}</span>
                                </div>
                                <h3 style={styles.productName}>{product.name}</h3>
                                <p style={styles.description}>{product.description}</p>
                                <p style={styles.stock}>Stock: {product.stock}</p>

                                <div style={styles.cardFooter}>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        style={styles.editBtn}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        style={styles.deleteBtn}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <ProductForm
                    onClose={() => { setShowForm(false); setEditProduct(null); }}
                    onSuccess={handleFormSuccess}
                    editProduct={editProduct}
                />
            )}

        </div>
    );
};

const styles = {
    container: { padding: '24px' },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '600',
        color: '#1a202c',
        margin: 0,
    },
    addBtn: {
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
    },
    message: {
        backgroundColor: '#f0fff4',
        border: '1px solid #9ae6b4',
        color: '#276749',
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
    },
    searchInput: {
        width: '100%',
        padding: '10px 14px',
        fontSize: '14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        marginBottom: '20px',
        boxSizing: 'border-box',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'contain',
        backgroundColor: '#f7fafc',
        padding: '8px',
    },
    cardBody: { padding: '16px' },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    category: {
        fontSize: '11px',
        backgroundColor: '#ebf4ff',
        color: '#3182ce',
        padding: '3px 8px',
        borderRadius: '20px',
        fontWeight: '500',
    },
    price: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#4f46e5',
    },
    productName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a202c',
        margin: '0 0 6px 0',
    },
    description: {
        fontSize: '13px',
        color: '#718096',
        margin: '0 0 8px 0',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    stock: {
        fontSize: '12px',
        color: '#48bb78',
        fontWeight: '500',
        margin: '0 0 12px 0',
    },
    cardFooter: {
        display: 'flex',
        gap: '8px',
    },
    editBtn: {
        flex: 1,
        padding: '8px',
        borderRadius: '8px',
        border: '1.5px solid #4f46e5',
        backgroundColor: '#ffffff',
        color: '#4f46e5',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '13px',
    },
    deleteBtn: {
        flex: 1,
        padding: '8px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#fed7d7',
        color: '#c53030',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '13px',
    },
    loadingText: {
        color: '#718096',
        textAlign: 'center',
        padding: '40px',
    },
    emptyText: {
        color: '#718096',
        textAlign: 'center',
        padding: '40px',
    },
};

export default ProductList;