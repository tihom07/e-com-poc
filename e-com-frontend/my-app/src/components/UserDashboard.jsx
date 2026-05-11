import { useState } from 'react';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';

const UserDashboard = ({ onNavigate }) => {

    const name = localStorage.getItem('name');
    const [page, setPage] = useState('products');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [placedOrder, setPlacedOrder] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        onNavigate('login');
    };

    const handleOrderSuccess = (order) => {
        setPlacedOrder(order);
        setPage('orderSuccess');
    };

    const renderPage = () => {
        switch (page) {
            case 'cart':
                return (
                    <Cart
                        onBack={() => setPage('products')}
                        onViewDetail={(id) => {
                            setSelectedProductId(id);
                            setPage('detail');
                        }}
                        onCheckout={() => setPage('checkout')}
                    />
                );
            case 'checkout':
                return (
                    <Checkout
                        onBack={() => setPage('cart')}
                        onOrderSuccess={handleOrderSuccess}
                    />
                );
            case 'orderSuccess':
                return (
                    <div style={styles.successBox}>
                        <p style={styles.successIcon}>🎉</p>
                        <h2 style={styles.successTitle}>Order Placed!</h2>
                        <p style={styles.successText}>
                            Order #{placedOrder?.id} has been placed successfully
                        </p>
                        <p style={styles.successAmount}>
                            Total: ${placedOrder?.totalPrice?.toFixed(2)}
                        </p>
                        <div style={styles.successBtns}>
                            <button
                                onClick={() => setPage('orders')}
                                style={styles.viewOrdersBtn}
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={() => setPage('products')}
                                style={styles.continueShoppingBtn}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <OrderHistory
                        onBack={() => setPage('products')}
                    />
                );
            case 'detail':
                return (
                    <ProductDetail
                        productId={selectedProductId}
                        onBack={() => setPage('products')}
                    />
                );
            default:
                return (
                    <ProductList
                        onViewDetail={(id) => {
                            setSelectedProductId(id);
                            setPage('detail');
                        }}
                    />
                );
        }
    };

    return (
        <div style={styles.wrapper}>

            <div style={styles.navbar}>
                <h2 style={styles.brand}>🛍️ MyShop</h2>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>👋 {name}</span>
                    <button
                        onClick={() => setPage('products')}
                        style={{
                            ...styles.navBtn,
                            backgroundColor: page === 'products' || page === 'detail'
                                ? '#ede9fe' : 'transparent',
                            color: page === 'products' || page === 'detail'
                                ? '#4f46e5' : '#4a5568',
                        }}
                    >
                        🏪 Products
                    </button>
                    <button
                        onClick={() => setPage('cart')}
                        style={{
                            ...styles.navBtn,
                            backgroundColor: page === 'cart' || page === 'checkout'
                                ? '#ede9fe' : 'transparent',
                            color: page === 'cart' || page === 'checkout'
                                ? '#4f46e5' : '#4a5568',
                        }}
                    >
                        🛒 Cart
                    </button>
                    <button
                        onClick={() => setPage('orders')}
                        style={{
                            ...styles.navBtn,
                            backgroundColor: page === 'orders' ? '#ede9fe' : 'transparent',
                            color: page === 'orders' ? '#4f46e5' : '#4a5568',
                        }}
                    >
                        📦 Orders
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                {renderPage()}
            </div>

        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '100vh',
        backgroundColor: '#f7fafc',
    },
    navbar: {
        backgroundColor: '#ffffff',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    brand: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: 0,
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    welcome: {
        fontSize: '14px',
        color: '#4a5568',
        fontWeight: '500',
    },
    navBtn: {
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
    },
    logoutBtn: {
        backgroundColor: '#fed7d7',
        color: '#c53030',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
    },
    successBox: {
        textAlign: 'center',
        padding: '80px 24px',
        maxWidth: '500px',
        margin: '0 auto',
    },
    successIcon: {
        fontSize: '72px',
        margin: '0 0 16px',
    },
    successTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 12px',
    },
    successText: {
        fontSize: '16px',
        color: '#718096',
        margin: '0 0 8px',
    },
    successAmount: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#4f46e5',
        margin: '0 0 32px',
    },
    successBtns: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
    },
    viewOrdersBtn: {
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '15px',
        width: '100%',
        maxWidth: '280px',
    },
    continueShoppingBtn: {
        backgroundColor: 'transparent',
        color: '#4f46e5',
        border: '1.5px solid #4f46e5',
        padding: '12px 32px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '15px',
        width: '100%',
        maxWidth: '280px',
    },
};

export default UserDashboard;