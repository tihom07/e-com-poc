import { useState, useEffect } from 'react';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';

const ProductDetail = ({ productId, onBack }) => {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cartMessage, setCartMessage] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const data = await getProductById(productId);
            setProduct(data);
        } catch (err) {
            setError('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await addToCart(product.id, quantity);
            setCartMessage('Added to cart successfully!');
        } catch (error) {
            setCartMessage('Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading product...</p>
        </div>
    );

    if (error) return (
        <div style={styles.centered}>
            <p style={styles.errorText}>{error}</p>
            <button onClick={onBack} style={styles.backBtn}>← Go Back</button>
        </div>
    );

    return (
        <div style={styles.container}>

            {/* Back button */}
            <button onClick={onBack} style={styles.backBtn}>
                ← Back to Products
            </button>

            <div style={styles.card}>

                {/* Left — Image */}
                <div style={styles.imageSection}>
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={styles.image}
                        />
                    ) : (
                        <div style={styles.noImage}>
                            <span style={styles.noImageText}>No Image</span>
                        </div>
                    )}
                </div>

                {/* Right — Details */}
                <div style={styles.detailsSection}>

                    <span style={styles.category}>{product.category}</span>

                    <h1 style={styles.productName}>{product.name}</h1>

                    <p style={styles.description}>{product.description}</p>

                    <div style={styles.priceRow}>
                        <span style={styles.price}>${product.price}</span>
                        <span style={{
                            ...styles.stockBadge,
                            backgroundColor: product.stock > 0 ? '#f0fff4' : '#fff5f5',
                            color: product.stock > 0 ? '#276749' : '#c53030',
                            border: `1px solid ${product.stock > 0 ? '#9ae6b4' : '#feb2b2'}`,
                        }}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.metaRow}>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Product ID</span>
                            <span style={styles.metaValue}>#{product.id}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Category</span>
                            <span style={styles.metaValue}>{product.category || 'N/A'}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Stock</span>
                            <span style={styles.metaValue}>{product.stock} units</span>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* Cart message */}
                    {cartMessage && (
                        <div style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: cartMessage.includes('Failed') ? '#fff5f5' : '#f0fff4',
                            border: `1px solid ${cartMessage.includes('Failed') ? '#feb2b2' : '#9ae6b4'}`,
                            color: cartMessage.includes('Failed') ? '#c53030' : '#276749',
                            fontSize: '14px',
                        }}>
                            {cartMessage}
                        </div>
                    )}

                    {/* Quantity selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            color: '#4a5568',
                            fontWeight: '500'
                        }}>
                            Quantity:
                        </span>
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            style={styles.qtyBtn}
                        >
                            −
                        </button>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            minWidth: '24px',
                            textAlign: 'center'
                        }}>
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                            style={styles.qtyBtn}
                        >
                            +
                        </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || addingToCart}
                        style={{
                            ...styles.addToCartBtn,
                            opacity: product.stock === 0 || addingToCart ? 0.5 : 1,
                            cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                    </button>

                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    centered: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '16px',
    },
    backBtn: {
        backgroundColor: 'transparent',
        border: '1.5px solid #e2e8f0',
        color: '#4a5568',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        marginBottom: '24px',
        display: 'inline-block',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
    },
    imageSection: {
        backgroundColor: '#f7fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '24px',
    },
    image: {
        width: '100%',
        height: '360px',
        objectFit: 'contain',
    },
    noImage: {
        width: '100%',
        height: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#edf2f7',
        borderRadius: '8px',
    },
    noImageText: {
        color: '#a0aec0',
        fontSize: '16px',
    },
    detailsSection: {
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    category: {
        fontSize: '12px',
        backgroundColor: '#ebf4ff',
        color: '#3182ce',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '500',
        display: 'inline-block',
        width: 'fit-content',
    },
    productName: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a202c',
        margin: 0,
        lineHeight: '1.3',
    },
    description: {
        fontSize: '15px',
        color: '#718096',
        lineHeight: '1.6',
        margin: 0,
    },
    priceRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    price: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#4f46e5',
    },
    stockBadge: {
        fontSize: '13px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '500',
    },
    divider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
    },
    metaRow: {
        display: 'flex',
        gap: '24px',
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    metaLabel: {
        fontSize: '12px',
        color: '#a0aec0',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    metaValue: {
        fontSize: '15px',
        color: '#2d3748',
        fontWeight: '600',
    },
    qtyBtn: {
        width: '30px',
        height: '30px',
        borderRadius: '6px',
        border: '1.5px solid #e2e8f0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartBtn: {
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        marginTop: '8px',
    },
    loadingText: {
        color: '#718096',
        fontSize: '16px',
    },
    errorText: {
        color: '#e53e3e',
        fontSize: '16px',
    },
};

export default ProductDetail;