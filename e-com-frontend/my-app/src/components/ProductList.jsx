import { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct, searchProducts } from '../api/productApi';
import ProductForm from './ProductForm';

const ProductList = ({ onViewDetail }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');

    const isAdmin = localStorage.getItem('role') === 'ADMIN';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
            const uniqueCategories = [
                ...new Set(data.map(p => p.category).filter(Boolean))
            ];
            setCategories(uniqueCategories);
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
            try {
                const results = await searchProducts(query);
                setProducts(results);
            } catch (error) {
                setMessage('Search failed');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setMessage('✅ Product deleted successfully');
            fetchProducts();
        } catch (error) {
            setMessage('❌ Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditProduct(null);
        setMessage(editProduct ? '✅ Product updated!' : '✅ Product added!');
        fetchProducts();
    };

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === '' ||
            product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.title}>Products</h2>
                {isAdmin && (
                    <button
                        onClick={() => { setEditProduct(null); setShowForm(true); }}
                        style={styles.addBtn}
                    >
                        + Add Product
                    </button>
                )}
            </div>

            {/* Message */}
            {message && (
                <div style={{
                    ...styles.message,
                    backgroundColor: message.includes('❌') ? '#fff5f5' : '#f0fff4',
                    border: `1px solid ${message.includes('❌') ? '#feb2b2' : '#9ae6b4'}`,
                    color: message.includes('❌') ? '#c53030' : '#276749',
                }}>
                    {message}
                </div>
            )}

            {/* Search */}
            <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={handleSearch}
                style={styles.searchInput}
            />

            {/* Category Filter */}
            <div style={styles.filterRow}>
                <button
                    onClick={() => setSelectedCategory('')}
                    style={{
                        ...styles.filterBtn,
                        backgroundColor: selectedCategory === '' ? '#4f46e5' : '#e2e8f0',
                        color: selectedCategory === '' ? '#ffffff' : '#4a5568',
                    }}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            ...styles.filterBtn,
                            backgroundColor: selectedCategory === cat ? '#4f46e5' : '#e2e8f0',
                            color: selectedCategory === cat ? '#ffffff' : '#4a5568',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Results count */}
            <p style={styles.resultsText}>
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory ? ` in "${selectedCategory}"` : ''}
                {searchQuery ? ` for "${searchQuery}"` : ''}
            </p>

            {/* Product Grid */}
            {loading ? (
                <p style={styles.loadingText}>Loading products...</p>
            ) : filteredProducts.length === 0 ? (
                <p style={styles.emptyText}>
                    No products found. {isAdmin ? 'Add your first product!' : ''}
                </p>
            ) : (
                <div style={styles.grid}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            style={{
                                ...styles.card,
                                opacity: product.stock === 0 ? 0.75 : 1,
                                cursor: product.stock === 0 && !isAdmin
                                    ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() => {
                                if (product.stock > 0 || isAdmin) {
                                    onViewDetail(product.id);
                                }
                            }}
                        >
                            {/* Out of stock badge */}
                            {product.stock === 0 && (
                                <div style={styles.outOfStockBadge}>
                                    OUT OF STOCK
                                </div>
                            )}

                            {/* Product Image */}
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
                                    <span style={styles.category}>
                                        {product.category}
                                    </span>
                                    <span style={styles.price}>
                                        ${product.price}
                                    </span>
                                </div>

                                <h3 style={styles.productName}>
                                    {product.name}
                                </h3>

                                <p style={styles.description}>
                                    {product.description}
                                </p>

                                <p style={{
                                    ...styles.stock,
                                    color: product.stock === 0
                                        ? '#e53e3e'
                                        : product.stock <= 5
                                            ? '#ed8936'
                                            : '#48bb78'
                                }}>
                                    {product.stock === 0
                                        ? 'Out of stock'
                                        : product.stock <= 5
                                            ? `Only ${product.stock} left!`
                                            : `${product.stock} in stock`}
                                </p>

                                {/* Admin only buttons */}
                                {isAdmin && (
                                    <div style={styles.cardFooter}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(product);
                                            }}
                                            style={styles.editBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(product.id);
                                            }}
                                            style={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Form Modal */}
            {showForm && (
                <ProductForm
                    onClose={() => {
                        setShowForm(false);
                        setEditProduct(null);
                    }}
                    onSuccess={handleFormSuccess}
                    editProduct={editProduct}
                />
            )}

        </div>
    );
};

const styles = {
    container: {
        padding: '24px'
    },
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
        marginBottom: '12px',
        boxSizing: 'border-box',
    },
    filterRow: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '12px',
    },
    filterBtn: {
        padding: '6px 16px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '13px',
    },
    resultsText: {
        fontSize: '13px',
        color: '#718096',
        marginBottom: '16px',
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
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
    },
    outOfStockBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: '#e53e3e',
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'contain',
        backgroundColor: '#f7fafc',
        padding: '8px',
    },
    cardBody: {
        padding: '16px'
    },
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