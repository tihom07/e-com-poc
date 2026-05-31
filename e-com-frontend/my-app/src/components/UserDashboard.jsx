import { useState } from 'react';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';
import Profile from './Profile';
import { formatINR } from '../utils/currency';

const C = {
    bg: '#FAFAFA', white: '#FFFFFF', ink: '#111111',
    muted: '#6B7280', border: '#E5E5E5', soft: '#F4F4F4',
};

export default function UserDashboard({ onNavigate }) {
    const name = localStorage.getItem('name') || 'there';
    const [page, setPage] = useState('home');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [placedOrder, setPlacedOrder] = useState(null);

    const handleLogout = () => {
        ['token','name','email','role'].forEach(k => localStorage.removeItem(k));
        onNavigate('login');
    };

    const go = (p) => setPage(p);

    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage onShop={() => go('products')} />;
            case 'cart': return <Cart onBack={() => go('products')} onViewDetail={id => { setSelectedProductId(id); go('detail'); }} onCheckout={() => go('checkout')} />;
            case 'checkout': return <Checkout onBack={() => go('cart')} onOrderSuccess={order => { setPlacedOrder(order); go('success'); }} />;
            case 'success': return <OrderSuccess order={placedOrder} onOrders={() => go('orders')} onShop={() => go('products')} />;
            case 'orders': return <OrderHistory onBack={() => go('products')} />;
            case 'profile': return <Profile onBack={() => go('products')} />;
            case 'detail': return <ProductDetail productId={selectedProductId} onBack={() => go('products')} />;
            default: return <ProductList onViewDetail={id => { setSelectedProductId(id); go('detail'); }} />;
        }
    };

    const navLinks = [
        { key: 'home', label: 'Home' },
        { key: 'products', label: 'Shop' },
        { key: 'orders', label: 'Orders' },
    ];

    const isActive = (key) => page === key || (key === 'products' && page === 'detail');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" }}>

            <nav style={nav.bar}>
                <span style={nav.logo} onClick={() => go('home')}>STRIDE</span>

                <div style={nav.links}>
                    {navLinks.map(l => (
                        <button key={l.key} onClick={() => go(l.key)} style={{
                            ...nav.link,
                            color: isActive(l.key) ? C.ink : C.muted,
                            borderBottom: isActive(l.key) ? `2px solid ${C.ink}` : '2px solid transparent',
                        }}>{l.label}</button>
                    ))}
                </div>

                <div style={nav.right}>
                    <button onClick={() => go('profile')} style={{
                        ...nav.iconBtn,
                        backgroundColor: page === 'profile' ? C.ink : C.soft,
                        color: page === 'profile' ? C.white : C.ink,
                    }}>
                        {name.charAt(0).toUpperCase()}
                    </button>
                    <button onClick={() => go('cart')} style={{
                        ...nav.cartBtn,
                        backgroundColor: (page === 'cart' || page === 'checkout') ? C.ink : C.soft,
                        color: (page === 'cart' || page === 'checkout') ? C.white : C.ink,
                    }}>
                        Cart
                    </button>
                    <button onClick={handleLogout} style={nav.logoutBtn}>Sign out</button>
                </div>
            </nav>

            <main>{renderPage()}</main>
        </div>
    );
}

const nav = {
    bar: {
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        padding: '0 48px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
    },
    logo: { fontSize: '13px', fontWeight: '800', letterSpacing: '5px', color: '#111111', cursor: 'pointer' },
    links: { display: 'flex', alignItems: 'stretch', height: '60px' },
    link: {
        background: 'none', border: 'none', borderBottom: '2px solid transparent',
        padding: '0 18px', fontSize: '13px', fontWeight: '600',
        cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.2px',
        display: 'flex', alignItems: 'center', transition: 'color 0.15s',
    },
    right: { display: 'flex', alignItems: 'center', gap: '10px' },
    iconBtn: {
        width: '34px', height: '34px', borderRadius: '50%',
        border: 'none', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '13px', fontWeight: '700',
        cursor: 'pointer', fontFamily: 'inherit',
    },
    cartBtn: {
        border: 'none', padding: '8px 18px', borderRadius: '8px',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
    },
    logoutBtn: {
        background: 'none', border: '1px solid #E5E5E5', color: '#9CA3AF',
        padding: '7px 16px', borderRadius: '8px', fontSize: '12px',
        fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
    },
};

function OrderSuccess({ order, onOrders, onShop }) {
    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderTop: '3px solid #111111', borderRadius: '16px', padding: '56px', maxWidth: '460px', width: '100%', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#F4F4F4', border: '2px solid #E5E5E5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 24px' }}>✓</div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#9CA3AF', margin: '0 0 12px', textTransform: 'uppercase' }}>Order confirmed</p>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>You're all set!</h2>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px' }}>Order #{order?.id}</p>
                <p style={{ fontSize: '32px', fontWeight: '800', color: '#111111', margin: '16px 0 32px', letterSpacing: '-1px' }}>{formatINR(order?.totalPrice)}</p>
                <div style={{ backgroundColor: '#F4F4F4', borderRadius: '10px', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
                    {[['Delivery', `${order?.city}, ${order?.state}`], ['Payment', order?.paymentMethod === 'COD' ? 'Cash on Delivery' : order?.paymentMethod], ['Status', 'Confirmed']].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #E5E5E5' }}>
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{k}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111111' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onOrders} style={{ flex: 1, backgroundColor: '#111111', color: '#FFFFFF', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>My Orders</button>
                    <button onClick={onShop} style={{ flex: 1, backgroundColor: '#F4F4F4', color: '#111111', border: '1px solid #E5E5E5', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Keep shopping</button>
                </div>
            </div>
        </div>
    );
}

function HomePage({ onShop }) {
    const heroImage = 'https://loremflickr.com/1800/1100/shoes,store?lock=2401';
    const cats = [
        { name: 'Formal', sub: 'Polished pairs for work and events', image: 'https://loremflickr.com/640/640/formal,shoe?lock=301' },
        { name: 'Basketball', sub: 'Court grip with bold street energy', image: 'https://loremflickr.com/640/640/basketball,shoe?lock=302' },
        { name: 'Casual', sub: 'Easy everyday shoes for clean outfits', image: 'https://loremflickr.com/640/640/sneakers,shoe?lock=303' },
        { name: 'Boots', sub: 'Structured styles for rougher days', image: 'https://loremflickr.com/640/640/boots,shoe?lock=304' },
    ];

    return (
        <div style={{ backgroundColor: '#FAFAFA' }}>

            {/* HERO */}
            <section style={{ position: 'relative', minHeight: '82vh', padding: '72px 48px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E5E5', backgroundImage: `linear-gradient(90deg, rgba(12,12,12,0.76) 0%, rgba(22,22,22,0.48) 48%, rgba(22,22,22,0.18) 100%), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px' }}>
                    <div style={{ maxWidth: '620px' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#D1D5DB', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px' }}>
                            Curated footwear
                        </p>
                        <h1 style={{ fontSize: '72px', fontWeight: '800', color: '#FFFFFF', lineHeight: '0.98', letterSpacing: '-2px', margin: '0 0 24px', textShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
                            Footwear for<br />
                            every plan.
                        </h1>
                        <p style={{ fontSize: '16px', color: '#E5E7EB', lineHeight: '1.7', margin: '0 0 32px', maxWidth: '460px' }}>
                            Formal polish, court-ready support, easy casuals, and sturdy boots in one clean collection.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '34px' }}>
                            {['Formal', 'Basketball', 'Casual', 'Boots'].map(label => (
                                <span key={label} style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.28)', padding: '7px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', backdropFilter: 'blur(8px)' }}>
                                    {label}
                                </span>
                            ))}
                        </div>
                        <button onClick={onShop} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFFFFF', color: '#111111', border: 'none', padding: '15px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 18px 44px rgba(0,0,0,0.22)' }}>
                            Shop all styles
                            <span style={{ backgroundColor: '#111111', color: '#FFFFFF', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>→</span>
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '300px' }}>
                        {[
                            ['25', 'curated shoes'],
                            ['4', 'style lanes'],
                            [formatINR(1499), 'starting price'],
                            ['30', 'day returns'],
                        ].map(([value, label]) => (
                            <div key={label} style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.6)', padding: '16px', borderRadius: '8px', minHeight: '92px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '24px', fontWeight: '900', color: '#111111', letterSpacing: '-0.8px' }}>{value}</div>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TICKER */}
            <div style={{ backgroundColor: '#111111', padding: '12px 48px', display: 'flex', gap: '48px', overflow: 'hidden' }}>
                {['FORMAL', 'BASKETBALL', 'CASUAL', 'BOOTS', 'VERSATILE FOOTWEAR', 'NEW PICKS'].map((t, i) => (
                    <span key={i} style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '2px', whiteSpace: 'nowrap', opacity: i % 2 === 0 ? 1 : 0.35 }}>
                        {t}
                    </span>
                ))}
            </div>

            {/* CATEGORIES */}
            <section style={{ padding: '80px 48px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>Browse by filter</p>
                    <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#111111', margin: '0 0 42px', letterSpacing: '-1.2px' }}>Choose your style lane</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px' }}>
                        {cats.map((c, i) => (
                            <button key={c.name} onClick={onShop} style={{ position: 'relative', minHeight: '260px', overflow: 'hidden', backgroundColor: '#111111', backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.68) 100%), url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <span style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.88)', color: '#111111', borderRadius: '999px', padding: '5px 9px', fontSize: '11px', fontWeight: '800' }}>
                                    0{i + 1}
                                </span>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', marginBottom: '7px', letterSpacing: '-0.3px' }}>{c.name}</div>
                                    <div style={{ fontSize: '13px', color: '#E5E7EB', lineHeight: '1.45', marginBottom: '16px' }}>{c.sub}</div>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>View shoes →</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '56px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                    {[
                        { n: '01', t: 'Work to weekend', d: 'A catalog that covers formal days, easy outings, and active plans.' },
                        { n: '02', t: 'Clear filters', d: 'Five focused categories make browsing faster and cleaner.' },
                        { n: '03', t: 'Fresh catalog', d: 'Twenty-five shoe options with prices, stock, and product details ready.' },
                        { n: '04', t: 'Simple checkout', d: 'Cart, payment, and order tracking stay in the same flow.' },
                    ].map((f) => (
                        <div key={f.n} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '900', color: '#9CA3AF', letterSpacing: '1.5px' }}>{f.n}</div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#111111' }}>{f.t}</div>
                            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{f.d}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', borderBottom: '1px solid #E5E5E5', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ maxWidth: '520px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>The whole rotation</p>
                    <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#111111', margin: '0 0 16px', letterSpacing: '-1.2px', lineHeight: '1.08' }}>
                        One store.<br />Every step.
                    </h2>
                    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.65', margin: '0 0 32px', maxWidth: '390px' }}>
                        Build your footwear rotation from polished formals to relaxed sneakers, strong boots, and performance pairs.
                    </p>
                    <button onClick={onShop} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111111', color: '#FFFFFF', border: 'none', padding: '15px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Browse all shoes →
                    </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '92px', fontWeight: '900', color: '#F0F0F0', letterSpacing: '-2px', lineHeight: '1', fontFamily: 'inherit' }}>VERSA</div>
                    <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '600' }}>Formal. Court. Casual. Outdoor.</div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ backgroundColor: '#111111', padding: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '4px', color: '#FFFFFF', marginBottom: '6px' }}>STRIDE</div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>Versatile footwear. Delivered.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {['Privacy', 'Terms', 'Contact', 'About'].map(l => (
                            <span key={l} style={{ fontSize: '13px', color: '#6B7280', cursor: 'pointer' }}>{l}</span>
                        ))}
                    </div>

                </div>
            </footer>

        </div>
    );
}
