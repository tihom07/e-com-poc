import { useState, useEffect } from 'react';
import { getOrders } from '../api/orderApi';

const OrderHistory = ({ onBack }) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { backgroundColor: '#fefcbf', color: '#744210' };
            case 'CONFIRMED':
                return { backgroundColor: '#c6f6d5', color: '#22543d' };
            case 'CANCELLED':
                return { backgroundColor: '#fed7d7', color: '#742a2a' };
            default:
                return { backgroundColor: '#e2e8f0', color: '#4a5568' };
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading orders...</p>
        </div>
    );

    return (
        <div style={styles.container}>

            <button onClick={onBack} style={styles.backBtn}>
                ← Back to Products
            </button>

            <h2 style={styles.title}>📦 My Orders</h2>

            {error && (
                <div style={styles.errorBox}>{error}</div>
            )}

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
                                    <p style={styles.orderId}>Order #{order.id}</p>
                                    <p style={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div style={styles.orderHeaderRight}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        ...getStatusStyle(order.status)
                                    }}>
                                        {order.status}
                                    </span>
                                    <p style={styles.orderTotal}>
                                        ${order.totalPrice?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={styles.orderItems}>
                                {order.items.map(item => (
                                    <div key={item.id} style={styles.orderItem}>
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
                                        <div style={styles.itemInfo}>
                                            <p style={styles.itemName}>
                                                {item.product.name}
                                            </p>
                                            <p style={styles.itemQty}>
                                                Qty: {item.quantity} × ${item.price}
                                            </p>
                                        </div>
                                        <p style={styles.itemTotal}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
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
        fontSize: '15px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 4px',
    },
    orderDate: {
        fontSize: '12px',
        color: '#718096',
        margin: 0,
    },
    orderHeaderRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
    },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.5px',
    },
    orderTotal: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: 0,
    },
    orderItems: {
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    orderItem: {
        display: 'grid',
        gridTemplateColumns: '48px 1fr auto',
        gap: '12px',
        alignItems: 'center',
    },
    itemImageBox: {
        width: '48px',
        height: '48px',
        borderRadius: '6px',
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
        fontSize: '16px',
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
    itemQty: {
        fontSize: '12px',
        color: '#718096',
        margin: 0,
    },
    itemTotal: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: 0,
    },
    loadingText: {
        color: '#718096',
        fontSize: '16px',
    },
};

export default OrderHistory;