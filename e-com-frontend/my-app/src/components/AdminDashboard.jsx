import { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const AdminDashboard = ({ onNavigate }) => {

    const name = localStorage.getItem('name');
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        onNavigate('login');
    };

    return (
        <div style={styles.wrapper}>

            {/* Admin Navbar */}
            <div style={styles.navbar}>
                <div style={styles.navLeft}>
                    <h2 style={styles.brand}>⚙️ Admin Panel</h2>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.adminBadge}>ADMIN</span>
                    <span style={styles.welcome}>👋 {name}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Admin Content */}
            <div style={styles.content}>

                {/* Stats Row */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>Total Products</p>
                        <p style={styles.statValue}>Manage below ↓</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>Role</p>
                        <p style={styles.statValue}>Administrator</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>Access</p>
                        <p style={styles.statValue}>Full Control</p>
                    </div>
                </div>

                {/* Product Management */}
                <ProductList onViewDetail={() => {}} />

            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '100vh',
        backgroundColor: '#f0f4ff',
    },
    navbar: {
        backgroundColor: '#1e1b4b',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    navLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    brand: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#ffffff',
        margin: 0,
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    adminBadge: {
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    welcome: {
        fontSize: '14px',
        color: '#c7d2fe',
        fontWeight: '500',
    },
    logoutBtn: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
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
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: '4px solid #4f46e5',
    },
    statLabel: {
        fontSize: '13px',
        color: '#718096',
        margin: '0 0 6px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    statValue: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1a202c',
        margin: 0,
    },
};

export default AdminDashboard;