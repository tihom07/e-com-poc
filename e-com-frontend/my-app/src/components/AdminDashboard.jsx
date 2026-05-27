import { useState, useEffect } from 'react';
import ProductList from './ProductList';
import axiosInstance from '../api/axiosInstance';
import { formatINR } from '../utils/currency';

const C = { bg: '#FAFAFA', white: '#FFFFFF', ink: '#111111', muted: '#6B7280', border: '#E5E5E5', soft: '#F4F4F4' };

export default function AdminDashboard({ onNavigate }) {
    const name = localStorage.getItem('name') || 'Admin';
    const [page, setPage] = useState('products');

    const handleLogout = () => {
        ['token','name','email','role'].forEach(k => localStorage.removeItem(k));
        onNavigate('login');
    };

    const tabs = [
        { key: 'products', label: 'Products' },
        { key: 'users', label: 'Users' },
        { key: 'orders', label: 'All Orders' },
    ];

    const renderPage = () => {
        switch (page) {
            case 'users': return <UserManagement />;
            case 'orders': return <AllOrders />;
            default: return <ProductList onViewDetail={() => {}} />;
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" }}>

            {/* Navbar */}
            <nav style={{ backgroundColor: C.ink, padding: '0 48px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '5px', color: C.white }}>STRIDE</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', letterSpacing: '1px', backgroundColor: '#1A1A1A', padding: '4px 10px', borderRadius: '4px' }}>ADMIN</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', marginRight: '8px' }}>Hi, {name}</span>
                    <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #2A2A2A', color: '#6B7280', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
                </div>
            </nav>

            {/* Tabs */}
            <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: '0 48px', display: 'flex', gap: '0' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setPage(t.key)} style={{
                        background: 'none', border: 'none',
                        borderBottom: page === t.key ? `2px solid ${C.ink}` : '2px solid transparent',
                        padding: '16px 20px', fontSize: '13px', fontWeight: '600',
                        color: page === t.key ? C.ink : C.muted,
                        cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px' }}>
                {renderPage()}
            </div>
        </div>
    );
}

/* ── User Management ── */
function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/admin/users');
            setUsers(res.data);
        } catch (e) {
            setMessage('❌ Failed to load users');
        } finally { setLoading(false); }
    };

    const fetchUserOrders = async (userId) => {
        setOrdersLoading(true);
        try {
            const res = await axiosInstance.get(`/admin/users/${userId}/orders`);
            setUserOrders(res.data);
        } catch (e) {
            setMessage('❌ Failed to load user orders');
        } finally { setOrdersLoading(false); }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        fetchUserOrders(user.id);
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Delete this order permanently?')) return;
        try {
            await axiosInstance.delete(`/admin/orders/${orderId}`);
            setMessage('✅ Order deleted successfully');
            fetchUserOrders(selectedUser.id);
        } catch (e) {
            setMessage('❌ Failed to delete order');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'CONFIRMED') return { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' };
        if (status === 'CANCELLED') return { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' };
        return { bg: '#F9FAFB', color: '#374151', border: '#E5E7EB' };
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>Loading users…</div>
    );

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', margin: '0 0 4px', letterSpacing: '-0.5px' }}>User Management</h2>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{users.length} registered users</p>
            </div>

            {message && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', backgroundColor: message.includes('❌') ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${message.includes('❌') ? '#FECACA' : '#BBF7D0'}`, color: message.includes('❌') ? '#991B1B' : '#166534' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 1fr' : '1fr', gap: '24px' }}>

                {/* Users list */}
                <div>
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '14px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E5E5', backgroundColor: '#F9FAFB' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>All Users</span>
                        </div>
                        {users.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No users found</div>
                        ) : (
                            users.map(user => (
                                <div key={user.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 20px', borderBottom: '1px solid #F4F4F4',
                                    backgroundColor: selectedUser?.id === user.id ? '#F9FAFB' : '#FFFFFF',
                                    cursor: 'pointer',
                                }} onClick={() => handleViewUser(user)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: user.role === 'ADMIN' ? '#111111' : '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: user.role === 'ADMIN' ? '#FFFFFF' : '#111111' }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111111' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{user.email}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', backgroundColor: user.role === 'ADMIN' ? '#111111' : '#F4F4F4', color: user.role === 'ADMIN' ? '#FFFFFF' : '#6B7280', letterSpacing: '0.5px' }}>
                                            {user.role}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>→</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* User order history */}
                {selectedUser && (
                    <div>
                        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '14px', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E5E5', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>{selectedUser.name}'s Orders</div>
                                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{selectedUser.email}</div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: '1px solid #E5E5E5', color: '#6B7280', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Close
                                </button>
                            </div>

                            {ordersLoading ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>Loading orders…</div>
                            ) : userOrders.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No orders found for this user</div>
                            ) : (
                                <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
                                    {userOrders.map(order => {
                                        const sc = getStatusColor(order.status);
                                        return (
                                            <div key={order.id} style={{ padding: '16px 20px', borderBottom: '1px solid #F4F4F4' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Order #{order.id}</div>
                                                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                                            {order.status}
                                                        </span>
                                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111111' }}>{formatINR(order.totalPrice)}</span>
                                                    </div>
                                                </div>

                                                {/* Order items */}
                                                <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                                                    {order.items?.map(item => (
                                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', color: '#374151' }}>
                                                            <span>{item.product?.name} × {item.quantity}</span>
                                                            <span style={{ fontWeight: '600' }}>{formatINR(item.price * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                                        {order.city}, {order.state} · {order.paymentMethod}
                                                    </div>
                                                    <button onClick={() => handleDeleteOrder(order.id)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── All Orders (admin view of every transaction) ── */
function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => { fetchAllOrders(); }, []);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/admin/orders');
            setOrders(res.data);
        } catch (e) {
            setMessage('❌ Failed to load orders');
        } finally { setLoading(false); }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Delete this order permanently?')) return;
        try {
            await axiosInstance.delete(`/admin/orders/${orderId}`);
            setMessage('✅ Order deleted');
            fetchAllOrders();
        } catch (e) {
            setMessage('❌ Failed to delete order');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'CONFIRMED') return { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' };
        if (status === 'CANCELLED') return { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' };
        return { bg: '#F9FAFB', color: '#374151', border: '#E5E7EB' };
    };

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
    const totalRevenue = orders.filter(o => o.status === 'CONFIRMED').reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', margin: '0 0 4px', letterSpacing: '-0.5px' }}>All Transactions</h2>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{orders.length} total orders</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '2px' }}>Total revenue</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#111111', letterSpacing: '-1px' }}>{formatINR(totalRevenue)}</div>
                </div>
            </div>

            {message && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', backgroundColor: message.includes('❌') ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${message.includes('❌') ? '#FECACA' : '#BBF7D0'}`, color: message.includes('❌') ? '#991B1B' : '#166534' }}>
                    {message}
                </div>
            )}

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                    { label: 'Total Orders', value: orders.length, sub: 'all time' },
                    { label: 'Confirmed', value: orders.filter(o => o.status === 'CONFIRMED').length, sub: 'successful' },
                    { label: 'Cancelled', value: orders.filter(o => o.status === 'CANCELLED').length, sub: 'refunded' },
                ].map((card, i) => (
                    <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '20px 24px' }}>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.3px' }}>{card.label}</div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#111111', letterSpacing: '-1px', lineHeight: '1' }}>{card.value}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['ALL', 'CONFIRMED', 'CANCELLED', 'PENDING'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        backgroundColor: filter === f ? '#111111' : '#F4F4F4',
                        color: filter === f ? '#FFFFFF' : '#6B7280',
                        border: 'none', padding: '7px 16px', borderRadius: '8px',
                        fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>Loading orders…</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF', fontSize: '14px' }}>No orders found</div>
            ) : (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '14px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 20px', borderBottom: '1px solid #E5E5E5', backgroundColor: '#F9FAFB', display: 'grid', gridTemplateColumns: '80px 1fr 1fr 100px 80px 80px', gap: '16px' }}>
                        {['Order', 'Customer', 'Items', 'Status', 'Total', 'Action'].map(h => (
                            <span key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '0.5px' }}>{h}</span>
                        ))}
                    </div>
                    {filtered.map(order => {
                        const sc = getStatusColor(order.status);
                        return (
                            <div key={order.id} style={{ padding: '14px 20px', borderBottom: '1px solid #F4F4F4', display: 'grid', gridTemplateColumns: '80px 1fr 1fr 100px 80px 80px', gap: '16px', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>#{order.id}</span>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#111111' }}>{order.fullName || '—'}</div>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                    {order.items?.map(i => `${i.product?.name} ×${i.quantity}`).join(', ') || '—'}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: 'inline-block', textAlign: 'center' }}>
                                    {order.status}
                                </span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111' }}>{formatINR(order.totalPrice)}</span>
                                <button onClick={() => handleDeleteOrder(order.id)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Delete
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
