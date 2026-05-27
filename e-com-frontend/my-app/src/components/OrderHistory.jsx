import { useState, useEffect } from 'react';
import { getOrders } from '../api/orderApi';
import axiosInstance from '../api/axiosInstance';
import { formatINR } from '../utils/currency';

const OrderHistory = ({ onBack }) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await axiosInstance.put(`/orders/${orderId}/cancel`);
            setMessage('✅ Order cancelled successfully. Stock has been restored.');
            fetchOrders();
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.error || 'Failed to cancel order'}`);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return {
                    backgroundColor: '#fefcbf',
                    color: '#744210',
                    border: '1px solid #f6e05e'
                };
            case 'CONFIRMED':
                return {
                    backgroundColor: '#c6f6d5',
                    color: '#22543d',
                    border: '1px solid #9ae6b4'
                };
            case 'CANCELLED':
                return {
                    backgroundColor: '#fed7d7',
                    color: '#742a2a',
                    border: '1px solid #feb2b2'
                };
            case 'DELIVERED':
                return {
                    backgroundColor: '#bee3f8',
                    color: '#2a4365',
                    border: '1px solid #90cdf4'
                };
            default:
                return {
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                    border: '1px solid #cbd5e0'
                };
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading orders...</p>
        </div>
    );

    return (
        <div style={styles.container}>

            {/* Back button */}
            <button onClick={onBack} style={styles.backBtn}>
                ← Back to Products
            </button>

            <h2 style={styles.title}>📦 My Orders</h2>

            {/* Error */}
            {error && (
                <div style={styles.errorBox}>{error}</div>
            )}

            {/* Message */}
            {message && (
                <div style={{
                    ...styles.messageBox,
                    backgroundColor: message.includes('❌') ? '#fff5f5' : '#f0fff4',
                    border: `1px solid ${message.includes('❌') ? '#feb2b2' : '#9ae6b4'}`,
                    color: message.includes('❌') ? '#c53030' : '#276749',
                }}>
                    {message}
                </div>
            )}

            {/* Empty */}
            {orders.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p style={styles.emptyIcon}>📦</p>
                    <p style={styles.emptyText}>No orders yet</p>
                    <button onClick={onBack} style={styles.shopBtn}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div style={styles.ordersList}>
                    {orders.map(order => (
                        <div key={order.id} style={styles.orderCard}>

                            {/* Order Header */}
                            <div style={styles.orderHeader}>
                                <div>
                                    <p style={styles.orderId}>
                                        Order #{order.id}
                                    </p>
                                    <p style={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString(
                                            'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <p style={styles.itemCount}>
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div style={styles.orderHeaderRight}>
                                    {/* Status Badge */}
                                    <span style={{
                                        ...styles.statusBadge,
                                        ...getStatusStyle(order.status)
                                    }}>
                                        {order.status}
                                    </span>

                                    {/* Total */}
                                    <p style={styles.orderTotal}>
                                        {formatINR(order.totalPrice)}
                                    </p>

                                    {/* Cancel button */}
                                    {(order.status === 'PENDING' ||
                                      order.status === 'CONFIRMED') && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            style={styles.cancelBtn}
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={styles.orderItems}>
                                {order.items.map(item => (
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
                                            <p style={styles.itemName}>
                                                {item.product.name}
                                            </p>
                                            <p style={styles.itemCategory}>
                                                {item.product.category}
                                            </p>
                                            <p style={styles.itemQty}>
                                                Qty: {item.quantity} x {formatINR(item.price)}
                                            </p>
                                        </div>

                                        {/* Item Total */}
                                        <div style={styles.itemTotalBox}>
                                            <p style={styles.itemTotal}>
                                                {formatINR(item.price * item.quantity)}
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div style={styles.orderFooter}>
                                <div style={styles.footerLeft}>
                                    {order.status === 'CANCELLED' && (
                                        <p style={styles.cancelledNote}>
                                            ℹ️ Stock has been restored for this order
                                        </p>
                                    )}
                                </div>
                                <div style={styles.footerRight}>
                                    <span style={styles.totalLabel}>Order Total:</span>
                                    <span style={styles.totalValue}>
                                        {formatINR(order.totalPrice)}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
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
    messageBox: {
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
    },
    emptyBox: {
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
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '16px 20px',
        backgroundColor: '#f7fafc',
        borderBottom: '1px solid #e2e8f0',
    },
    orderId: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 4px',
    },
    orderDate: {
        fontSize: '12px',
        color: '#718096',
        margin: '0 0 4px',
    },
    itemCount: {
        fontSize: '12px',
        color: '#a0aec0',
        margin: 0,
    },
    orderHeaderRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.5px',
    },
    orderTotal: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: 0,
    },
    cancelBtn: {
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        color: '#c53030',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '12px',
    },
    orderItems: {
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    orderItem: {
        display: 'grid',
        gridTemplateColumns: '56px 1fr auto',
        gap: '12px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #f7fafc',
    },
    itemImageBox: {
        width: '56px',
        height: '56px',
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
        fontSize: '11px',
        color: '#a0aec0',
        margin: 0,
    },
    itemQty: {
        fontSize: '12px',
        color: '#718096',
        margin: 0,
    },
    itemTotalBox: {
        textAlign: 'right',
    },
    itemTotal: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: 0,
    },
    orderFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#f7fafc',
        borderTop: '1px solid #e2e8f0',
    },
    footerLeft: {
        flex: 1,
    },
    cancelledNote: {
        fontSize: '12px',
        color: '#718096',
        margin: 0,
    },
    footerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    totalLabel: {
        fontSize: '14px',
        color: '#718096',
        fontWeight: '500',
    },
    totalValue: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#4f46e5',
    },
    loadingText: {
        color: '#718096',
        fontSize: '16px',
    },
};

export default OrderHistory;
