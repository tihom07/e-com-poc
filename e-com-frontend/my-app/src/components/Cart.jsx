import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../api/cartApi';

const Cart = ({ onBack, onViewDetail, onCheckout }) => {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCart(data);
        } catch (error) {
            setMessage('❌ Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity, stock) => {

        //  Validation 1 — remove if quantity goes to 0
        if (newQuantity < 1) {
            handleRemove(itemId);
            return;
        }

        //  Validation 2 — quantity cannot exceed stock
        if (newQuantity > stock) {
            setMessage(`❌ Only ${stock} items available in stock`);
            return;
        }

        try {
            const data = await updateCartItem(itemId, newQuantity);
            setCart(data);
            setMessage('');
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to update quantity';
            setMessage(`❌ ${errorMsg}`);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            const data = await removeFromCart(itemId);
            setCart(data);
            setMessage('✅ Item removed from cart');
        } catch (error) {
            setMessage('❌ Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Clear all items from cart?')) return;
        try {
            await clearCart();
            setCart({ ...cart, items: [] });
            setMessage('✅ Cart cleared');
        } catch (error) {
            setMessage('❌ Failed to clear cart');
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading cart...</p>
        </div>
    );

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <button onClick={onBack} style={styles.backBtn}>
                    ← Back to Products
                </button>
                <h2 style={styles.title}>🛒 My Cart</h2>
                {!isEmpty && (
                    <button onClick={handleClearCart} style={styles.clearBtn}>
                        Clear Cart
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

            {/* Empty Cart */}
            {isEmpty ? (
                <div style={styles.emptyCart}>
                    <p style={styles.emptyIcon}>🛒</p>
                    <p style={styles.emptyText}>Your cart is empty</p>
                    <button onClick={onBack} style={styles.shopBtn}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div style={styles.cartLayout}>

                    {/* Cart Items */}
                    <div style={styles.itemsList}>
                        {cart.items.map(item => (
                            <div key={item.id} style={styles.cartItem}>

                                {/* Product Image */}
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

                                {/* Product Info */}
                                <div style={styles.itemInfo}>
                                    <h3
                                        style={styles.itemName}
                                        onClick={() => onViewDetail(item.product.id)}
                                    >
                                        {item.product.name}
                                    </h3>
                                    <p style={styles.itemCategory}>
                                        {item.product.category}
                                    </p>
                                    <p style={styles.itemPrice}>
                                        ${item.product.price} each
                                    </p>
                                    <p style={{
                                        fontSize: '12px',
                                        color: item.product.stock > 0 ? '#48bb78' : '#e53e3e',
                                        margin: 0,
                                        fontWeight: '500'
                                    }}>
                                        {item.product.stock > 0
                                            ? `${item.product.stock} in stock`
                                            : 'Out of stock'}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div style={styles.quantityControls}>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => handleQuantityChange(
                                            item.id,
                                            item.quantity - 1,
                                            item.product.stock
                                        )}
                                    >
                                        −
                                    </button>
                                    <span style={styles.qtyValue}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        style={{
                                            ...styles.qtyBtn,
                                            opacity: item.quantity >= item.product.stock
                                                ? 0.4 : 1,
                                            cursor: item.quantity >= item.product.stock
                                                ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => handleQuantityChange(
                                            item.id,
                                            item.quantity + 1,
                                            item.product.stock
                                        )}
                                        disabled={item.quantity >= item.product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div style={styles.itemTotal}>
                                    <p style={styles.totalPrice}>
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        style={styles.removeBtn}
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={styles.summary}>
                        <h3 style={styles.summaryTitle}>Order Summary</h3>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Total Items</span>
                            <span style={styles.summaryValue}>
                                {cart.totalItems}
                            </span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Subtotal</span>
                            <span style={styles.summaryValue}>
                                ${cart.totalPrice?.toFixed(2)}
                            </span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Shipping</span>
                            <span style={{
                                ...styles.summaryValue,
                                color: '#48bb78'
                            }}>
                                FREE
                            </span>
                        </div>

                        <div style={styles.divider} />

                        <div style={styles.summaryRow}>
                            <span style={{
                                ...styles.summaryLabel,
                                fontWeight: '700',
                                fontSize: '16px',
                                color: '#1a202c'
                            }}>
                                Total
                            </span>
                            <span style={{
                                ...styles.summaryValue,
                                fontWeight: '700',
                                fontSize: '20px',
                                color: '#4f46e5'
                            }}>
                                ${cart.totalPrice?.toFixed(2)}
                            </span>
                        </div>

                        {/*  Proceed to Checkout button */}
                        <button
                            style={styles.checkoutBtn}
                            onClick={onCheckout}
                        >
                            Proceed to Checkout
                        </button>

                        <button onClick={onBack} style={styles.continueBtn}>
                            Continue Shopping
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a202c',
        margin: 0,
        flex: 1,
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
    },
    clearBtn: {
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        color: '#c53030',
        padding: '8px 16px',
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
    emptyCart: {
        textAlign: 'center',
        padding: '80px 24px',
    },
    emptyIcon: {
        fontSize: '64px',
        margin: '0 0 16px',
    },
    emptyText: {
        fontSize: '18px',
        color: '#718096',
        margin: '0 0 24px',
    },
    shopBtn: {
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '15px',
    },
    cartLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '24px',
        alignItems: 'flex-start',
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    cartItem: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto auto',
        gap: '16px',
        alignItems: 'center',
    },
    itemImageBox: {
        width: '80px',
        height: '80px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f7fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    noImage: {
        fontSize: '24px',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    itemName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#4f46e5',
        margin: 0,
        cursor: 'pointer',
    },
    itemCategory: {
        fontSize: '12px',
        color: '#a0aec0',
        margin: 0,
    },
    itemPrice: {
        fontSize: '13px',
        color: '#718096',
        margin: 0,
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    qtyBtn: {
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        border: '1.5px solid #e2e8f0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
    },
    qtyValue: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a202c',
        minWidth: '20px',
        textAlign: 'center',
    },
    itemTotal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
    },
    totalPrice: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1a202c',
        margin: 0,
    },
    removeBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#e53e3e',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
    },
    summary: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: '24px',
    },
    summaryTitle: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 20px',
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
    checkoutBtn: {
        width: '100%',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '12px',
    },
    continueBtn: {
        width: '100%',
        backgroundColor: 'transparent',
        color: '#4f46e5',
        border: '1.5px solid #4f46e5',
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
};

export default Cart;