import { useState } from 'react';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Cart from './Cart';

const UserDashboard = ({ onNavigate }) => {

    const name = localStorage.getItem('name');
    const [page, setPage] = useState('products');
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        onNavigate('login');
    };

    const renderPage = () => {
        if (page === 'cart') {
            return (
                <Cart
                    onBack={() => setPage('products')}
                    onViewDetail={(id) => {
                        setSelectedProductId(id);
                        setPage('detail');
                    }}
                />
            );
        }
        if (page === 'detail' && selectedProductId) {
            return (
                <ProductDetail
                    productId={selectedProductId}
                    onBack={() => setPage('products')}
                />
            );
        }
        return (
            <ProductList
                onViewDetail={(id) => {
                    setSelectedProductId(id);
                    setPage('detail');
                }}
            />
        );
    };

    return (
        <div style={styles.wrapper}>

            {/* User Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.brand}>🛍️ MyShop</h2>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>👋 {name}</span>
                    <button
                        onClick={() => setPage('products')}
                        style={{
                            ...styles.navBtn,
                            backgroundColor: page === 'products' ? '#ede9fe' : 'transparent',
                            color: page === 'products' ? '#4f46e5' : '#4a5568',
                        }}
                    >
                        🏪 Products
                    </button>
                    <button
                        onClick={() => setPage('cart')}
                        style={{
                            ...styles.navBtn,
                            backgroundColor: page === 'cart' ? '#ede9fe' : 'transparent',
                            color: page === 'cart' ? '#4f46e5' : '#4a5568',
                        }}
                    >
                        🛒 Cart
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            {/* User Content */}
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
};

export default UserDashboard;