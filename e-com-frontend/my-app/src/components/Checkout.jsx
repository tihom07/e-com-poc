import { useState } from 'react';
import { checkout } from '../api/orderApi';
import { getCart } from '../api/cartApi';
import { useEffect } from 'react';

const Checkout = ({ onBack, onOrderSuccess }) => {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCart(data);
        } catch (err) {
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        setPlacing(true);
        setError('');
        try {
            const order = await checkout();
            onOrderSuccess(order);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading order summary...</p>
        </div>
    );

    if (!cart || cart.items.length === 0) return (
        <div style={styles.centered}>
            <p style={styles.emptyText}>Your cart is empty</p>
            <button onClick={onBack} style={styles.backBtn}>← Go Back</button>
        </div>
    );

    return (
        <div style={styles.container}>

            <button onClick={onBack} style={styles.backBtn}>
                ← Back to Cart
            </button>

            <h2 style={styles.title}>Order Summary</h2>

            {error && (
                <div style={styles.errorBox}>{error}</div>
            )}

            <div style={styles.layout}>

                {/* Order Items */}
                <div style={styles.itemsSection}>
                    <h3 style={styles.sectionTitle}>Items in your order</h3>

                    {cart.items.map(item => (
                        <div key={item.id} style={styles.orderItem}>

                            {/* Image */}
                            <div style={styles.itemImageBox}>
                                {item.product.imageUrl ? (
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        style={styles.itemImage}
                                    />
                                ) : (
                                    <div style={styles.noImage}>🖼️</div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={styles.itemInfo}>
                                <p style={styles.itemName}>{item.product.name}</p>
                                <p style={styles.itemCategory}>{item.product.category}</p>
                                <p style={styles.itemQty}>Qty: {item.quantity}</p>
                            </div>

                            {/* Price */}
                            <p style={styles.itemPrice}>
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </p>

                        </div>
                    ))}
                </div>

                {/* Payment Summary */}
                <div style={styles.paymentSection}>
                    <h3 style={styles.sectionTitle}>Payment Details</h3>

                    <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>Total Items</span>
                        <span style={styles.summaryValue}>{cart.totalItems}</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>Subtotal</span>
                        <span style={styles.summaryValue}>
                            ${cart.totalPrice?.toFixed(2)}
                        </span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>Shipping</span>
                        <span style={{ ...styles.summaryValue, color: '#48bb78' }}>
                            FREE
                        </span>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.summaryRow}>
                        <span style={{
                            ...styles.summaryLabel,
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1a202c'
                        }}>
                            Total
                        </span>
                        <span style={{
                            ...styles.summaryValue,
                            fontSize: '22px',
                            fontWeight: '700',
                            color: '#4f46e5'
                        }}>
                            ${cart.totalPrice?.toFixed(2)}
                        </span>
                    </div>

                    <div style={styles.divider} />

                    {/* Order info */}
                    <div style={styles.infoBox}>
                        <p style={styles.infoText}>
                            📦 Your order will be placed immediately
                        </p>
                        <p style={styles.infoText}>
                            🔄 Stock will be updated automatically
                        </p>
                        <p style={styles.infoText}>
                            🛒 Cart will be cleared after order
                        </p>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        style={{
                            ...styles.placeOrderBtn,
                            opacity: placing ? 0.7 : 1,
                            cursor: placing ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {placing ? 'Placing Order...' : '✅ Place Order'}
                    </button>

                    <button onClick={onBack} style={styles.cancelBtn}>
                        Cancel
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
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 24px',
    },
    errorBox: {
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        color: '#c53030',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        alignItems: 'flex-start',
    },
    itemsSection: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a202c',
        margin: '0 0 20px',
    },
    orderItem: {
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gap: '16px',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    itemImageBox: {
        width: '64px',
        height: '64px',
        borderRadius: '8px',
        backgroundColor: '#f7fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    noImage: {
        fontSize: '20px',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    itemName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a202c',
        margin: 0,
    },
    itemCategory: {
        fontSize: '12px',
        color: '#a0aec0',
        margin: 0,
    },
    itemQty: {
        fontSize: '12px',
        color: '#718096',
        margin: 0,
    },
    itemPrice: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: 0,
    },
    paymentSection: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: '24px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    summaryLabel: {
        fontSize: '14px',
        color: '#718096',
    },
    summaryValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
    },
    divider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '16px 0',
    },
    infoBox: {
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    infoText: {
        fontSize: '12px',
        color: '#4a5568',
        margin: 0,
    },
    placeOrderBtn: {
        width: '100%',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        marginBottom: '12px',
    },
    cancelBtn: {
        width: '100%',
        backgroundColor: 'transparent',
        color: '#718096',
        border: '1.5px solid #e2e8f0',
        padding: '12px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    loadingText: {
        color: '#718096',
        fontSize: '16px',
    },
    emptyText: {
        color: '#718096',
        fontSize: '16px',
    },
};

export default Checkout;