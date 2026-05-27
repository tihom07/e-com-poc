import { useState, useEffect } from 'react';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { formatINR } from '../utils/currency';

const C = {
    bg: '#FAFAFA', white: '#FFFFFF', ink: '#111111',
    muted: '#6B7280', border: '#E5E5E5', soft: '#F4F4F4',
};

const ProductDetail = ({ productId, onBack }) => {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cartMessage, setCartMessage] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

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
        if (product.stock <= 0) { setCartMessage('This product is out of stock'); return; }
        if (quantity < 1) { setCartMessage('Quantity must be at least 1'); return; }
        if (quantity > product.stock) { setCartMessage(`Only ${product.stock} items available`); return; }
        setAddingToCart(true);
        setCartMessage('');
        try {
            await addToCart(product.id, quantity);
            setCartMessage('✅ Added to cart successfully!');
        } catch (error) {
            setCartMessage(`❌ ${error.response?.data?.error || 'Failed to add to cart'}`);
        } finally {
            setAddingToCart(false);
        }
    };

    const buildDescriptionRows = (product) => [
        { label: 'Brand', value: 'STRIDE' },
        { label: 'Product Name', value: product.name },
        { label: 'Category', value: product.category || 'Footwear' },
        { label: 'Ideal For', value: 'Men and Women' },
        { label: 'Occasion', value: 'Running, training and casual wear' },
        { label: 'Upper Material', value: 'Breathable comfort upper' },
        { label: 'Sole Material', value: 'Slip-resistant rubber outsole' },
        { label: 'Fit Type', value: 'Regular fit' },
        { label: 'Product Description', value: product.description || `Experience premium comfort and style with the ${product.name}. Designed for everyday wear, this shoe combines durability, cushioning and clean design for reliable daily performance.` },
    ];

    const buildSpecs = (product) => [
        { label: 'Product Name', value: product.name },
        { label: 'Category', value: product.category || '—' },
        { label: 'Price', value: formatINR(product.price) },
        { label: 'Stock Available', value: product.stock > 0 ? `${product.stock} units` : 'Out of stock' },
        { label: 'Product ID', value: `#${product.id}` },
        { label: 'Availability', value: product.stock > 0 ? 'In Stock' : 'Out of Stock' },
        { label: 'Return Policy', value: '30 days hassle-free return' },
        { label: 'Warranty', value: '6 months manufacturer warranty' },
        { label: 'Delivery', value: 'Free delivery on all orders' },
        { label: 'Authenticity', value: '100% authentic guaranteed' },
    ];

    if (loading) return (
        <div style={s.centered}>
            <p style={s.loadingText}>Loading product…</p>
        </div>
    );

    if (error) return (
        <div style={s.centered}>
            <p style={s.errorText}>{error}</p>
            <button onClick={onBack} style={s.backBtn}>← Go Back</button>
        </div>
    );

    const priceInr = Number(product.price) || 0;

    return (
        <div style={s.wrapper}>

            {/* Breadcrumb */}
            <div style={s.breadcrumb}>
                <button onClick={onBack} style={s.breadBtn}>All Products</button>
                <span style={s.breadSep}>/</span>
                <span style={s.breadCurrent}>{product.name}</span>
            </div>

            <div style={s.container}>

                {/* ── LEFT: Image ── */}
                <div style={s.imageCol}>

                    {/* Main image — human wearing shoe */}
                    <div style={s.mainImageBox}>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={s.mainImage}
                                onError={e => e.target.style.display = 'none'}
                            />
                        ) : (
                            /* Placeholder when no image — human wearing shoe scene */
                            <div style={s.placeholderBox}>
                                <div style={s.placeholderScene}>
                                    {/* Simple SVG of person wearing shoe */}
                                    <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Leg */}
                                        <rect x="80" y="0" width="28" height="160" rx="14" fill="#D1D5DB"/>
                                        {/* Ankle */}
                                        <rect x="76" y="148" width="36" height="28" rx="8" fill="#9CA3AF"/>
                                        {/* Shoe body */}
                                        <path d="M60 176 C60 168 68 164 80 164 L112 164 C112 164 130 164 145 172 C158 179 165 188 162 196 C159 202 150 206 138 206 L70 206 C64 206 58 202 58 196 L58 184 C58 180 59 178 60 176Z" fill="#111111"/>
                                        {/* Shoe sole */}
                                        <path d="M56 196 C56 190 62 188 70 188 L162 188 C168 188 168 196 162 200 C156 204 140 208 110 208 C80 208 62 206 56 200 Z" fill="#374151"/>
                                        {/* Shoe toe box */}
                                        <path d="M130 168 C140 168 155 172 162 180 L162 196 C155 190 140 185 128 184 Z" fill="#1F2937"/>
                                        {/* Laces */}
                                        <line x1="88" y1="172" x2="120" y2="172" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="86" y1="178" x2="118" y2="178" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="84" y1="184" x2="116" y2="184" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                                        {/* Swoosh-like detail */}
                                        <path d="M70 190 C85 182 105 180 125 185" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                        {/* Ground shadow */}
                                        <ellipse cx="110" cy="215" rx="72" ry="10" fill="#E5E7EB"/>
                                    </svg>
                                </div>
                                <p style={s.placeholderLabel}>No image uploaded</p>
                            </div>
                        )}

                        {/* Out of stock overlay */}
                        {product.stock === 0 && (
                            <div style={s.outOfStockOverlay}>
                                <span style={s.outOfStockText}>OUT OF STOCK</span>
                            </div>
                        )}
                    </div>

                    {/* Image note */}
                    <div style={s.imageNote}>
                        <span style={s.imageNoteIcon}>🔒</span>
                        <span>100% Authentic product. Verified quality.</span>
                    </div>

                </div>

                {/* ── RIGHT: Details ── */}
                <div style={s.detailCol}>

                    {/* Category pill */}
                    <div style={s.categoryPill}>{product.category || 'Footwear'}</div>

                    {/* Product name */}
                    <h1 style={s.productName}>{product.name}</h1>

                    {/* Rating row — static for now */}
                    <div style={s.ratingRow}>
                        <div style={s.stars}>★★★★☆</div>
                        <span style={s.ratingCount}>4.2 out of 5</span>
                        <span style={s.ratingDivider}>|</span>
                        <span style={s.ratingReviews}>128 ratings</span>
                    </div>

                    <div style={s.priceDivider} />

                    {/* Price */}
                    <div style={s.priceBlock}>
                        <div style={s.priceRow}>
                            <span style={s.priceLabel}>M.R.P.:</span>
                            <span style={s.priceMrp}>{formatINR(priceInr * 1.15)}</span>
                        </div>
                        <div style={s.priceRow}>
                            <span style={s.priceLabel}>Price:</span>
                            <span style={s.priceValue}>{formatINR(priceInr)}</span>
                            <span style={s.priceDiscount}>Save 13%</span>
                        </div>
                        <p style={s.taxNote}>Inclusive of all taxes. Free delivery.</p>
                    </div>

                    <div style={s.priceDivider} />

                    {/* Stock status */}
                    <div style={s.stockRow}>
                        <span style={s.stockLabel}>Availability:</span>
                        <span style={{
                            ...s.stockValue,
                            color: product.stock === 0 ? '#DC2626' : product.stock <= 5 ? '#D97706' : '#16A34A',
                        }}>
                            {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left — order soon!` : 'In Stock'}
                        </span>
                    </div>

                    {/* Description short */}
                    {product.description && (
                        <p style={s.shortDesc}>{product.description}</p>
                    )}

                    {/* Quantity + Add to cart */}
                    <div style={s.cartSection}>
                        <div style={s.qtyRow}>
                            <span style={s.qtyLabel}>Qty:</span>
                            <div style={s.qtyControls}>
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    style={s.qtyBtn}
                                    disabled={product.stock === 0}
                                >−</button>
                                <span style={s.qtyValue}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    style={s.qtyBtn}
                                    disabled={product.stock === 0}
                                >+</button>
                            </div>
                        </div>

                        {cartMessage && (
                            <div style={{
                                ...s.cartMsg,
                                backgroundColor: cartMessage.includes('❌') ? '#FEF2F2' : '#F0FDF4',
                                border: `1px solid ${cartMessage.includes('❌') ? '#FECACA' : '#BBF7D0'}`,
                                color: cartMessage.includes('❌') ? '#991B1B' : '#166534',
                            }}>
                                {cartMessage}
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || addingToCart}
                            style={{
                                ...s.addToCartBtn,
                                opacity: product.stock === 0 || addingToCart ? 0.5 : 1,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {addingToCart ? 'Adding…' : '🛒 Add to Cart'}
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div style={s.badges}>
                        {[
                            { icon: '🔄', text: '30-day returns' },
                            { icon: '✓', text: 'Authentic' },
                            { icon: '📦', text: 'Free delivery' },
                        ].map((b, i) => (
                            <div key={i} style={s.badge}>
                                <span style={s.badgeIcon}>{b.icon}</span>
                                <span style={s.badgeText}>{b.text}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* ── TABS: Description / Specs / Reviews ── */}
            <div style={s.tabsSection}>

                <div style={s.tabBar}>
                    {[
                        { key: 'description', label: 'Product Description' },
                        { key: 'specs', label: 'Specifications' },
                        { key: 'delivery', label: 'Delivery & Returns' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                ...s.tabBtn,
                                color: activeTab === tab.key ? C.ink : C.muted,
                                borderBottom: activeTab === tab.key ? `2px solid ${C.ink}` : '2px solid transparent',
                                fontWeight: activeTab === tab.key ? '700' : '500',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={s.tabContent}>

                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <div>
                            <h3 style={s.descFeatTitle}>Product Details</h3>
                            <table style={s.descTable}>
                                <tbody>
                                    {buildDescriptionRows(product).map((row, i) => (
                                        <tr key={row.label} style={{ backgroundColor: i % 2 === 0 ? '#F7F7F7' : '#FFFFFF' }}>
                                            <td style={s.descKey}>{row.label}</td>
                                            <td style={s.descVal}>{row.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={s.descFeatures}>
                                {[
                                    'Cushioned support for long wear',
                                    'Clean profile for daily styling',
                                    'Durable sole grip for better traction',
                                ].map((f, i) => (
                                    <div key={i} style={s.descFeaturePill}>{f}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specifications Tab — Amazon style table */}
                    {activeTab === 'specs' && (
                        <div>
                            <h3 style={s.specsTitle}>Product Information</h3>
                            <table style={s.specsTable}>
                                <tbody>
                                    {buildSpecs(product).map((row, i) => (
                                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#F9FAFB' : '#FFFFFF' }}>
                                            <td style={s.specKey}>{row.label}</td>
                                            <td style={s.specVal}>{row.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={s.specsNote}>
                                <span style={{ fontWeight: '600', color: C.ink }}>Note:</span> Specifications are subject to change. Please verify at time of purchase.
                            </div>
                        </div>
                    )}

                    {/* Delivery Tab */}
                    {activeTab === 'delivery' && (
                        <div style={s.deliveryGrid}>
                            {[
                                { icon: '📦', title: 'Free Delivery', desc: 'Free standard delivery on all orders. Expected delivery in 3-5 business days.' },
                                { icon: '🔄', title: '30-Day Returns', desc: 'Not satisfied? Return within 30 days for a full refund. No questions asked.' },
                                { icon: '✓', title: 'Authenticity Guarantee', desc: 'Every product is verified for authenticity before shipping. 100% genuine.' },
                                { icon: '🛡️', title: 'Secure Packaging', desc: 'Your shoes are packed securely to ensure they arrive in perfect condition.' },
                            ].map((d, i) => (
                                <div key={i} style={s.deliveryCard}>
                                    <div style={s.deliveryIcon}>{d.icon}</div>
                                    <div style={s.deliveryTitle}>{d.title}</div>
                                    <div style={s.deliveryDesc}>{d.desc}</div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};

const s = {
    wrapper: {
        backgroundColor: '#FAFAFA',
        minHeight: '100vh',
        fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
    },
    centered: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: '16px',
    },
    loadingText: { color: '#9CA3AF', fontSize: '15px' },
    errorText: { color: '#DC2626', fontSize: '15px' },
    backBtn: {
        backgroundColor: 'transparent', border: '1.5px solid #E5E5E5',
        color: '#6B7280', padding: '8px 16px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
    },

    /* Breadcrumb */
    breadcrumb: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '16px 48px', borderBottom: '1px solid #E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    breadBtn: {
        background: 'none', border: 'none', color: '#6B7280',
        fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
        textDecoration: 'underline', textUnderlineOffset: '2px', padding: 0,
    },
    breadSep: { color: '#D1D5DB', fontSize: '13px' },
    breadCurrent: { color: '#111111', fontSize: '13px', fontWeight: '600' },

    /* Main grid */
    container: {
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0', maxWidth: '1200px', margin: '0 auto',
        backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5',
    },

    /* Image column */
    imageCol: {
        padding: '40px 48px',
        borderRight: '1px solid #E5E5E5',
        display: 'flex', flexDirection: 'column', gap: '16px',
    },
    mainImageBox: {
        position: 'relative',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E5E5',
        borderRadius: '16px',
        overflow: 'hidden',
        aspectRatio: '1 / 1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    mainImage: {
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
    },
    placeholderBox: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '16px', padding: '40px',
    },
    placeholderScene: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '240px', height: '240px',
    },
    placeholderLabel: { fontSize: '13px', color: '#9CA3AF', margin: 0 },
    outOfStockOverlay: {
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    outOfStockText: {
        fontSize: '16px', fontWeight: '800', color: '#DC2626',
        letterSpacing: '2px', border: '2px solid #DC2626',
        padding: '10px 20px',
    },
    imageNote: {
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '12px', color: '#9CA3AF',
        backgroundColor: '#F9FAFB', border: '1px solid #E5E5E5',
        borderRadius: '8px', padding: '10px 14px',
    },
    imageNoteIcon: { fontSize: '14px' },

    /* Detail column */
    detailCol: {
        padding: '40px 48px',
        display: 'flex', flexDirection: 'column', gap: '16px',
    },
    categoryPill: {
        display: 'inline-block',
        backgroundColor: '#F4F4F4', color: '#6B7280',
        fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
        padding: '4px 12px', borderRadius: '4px',
        textTransform: 'uppercase', width: 'fit-content',
    },
    productName: {
        fontSize: '26px', fontWeight: '800', color: '#111111',
        margin: 0, letterSpacing: '-0.5px', lineHeight: '1.25',
    },
    ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    stars: { color: '#F59E0B', fontSize: '16px', letterSpacing: '1px' },
    ratingCount: { fontSize: '14px', color: '#6B7280' },
    ratingDivider: { color: '#D1D5DB' },
    ratingReviews: { fontSize: '13px', color: '#6B7280' },
    priceDivider: { height: '1px', backgroundColor: '#E5E5E5' },

    /* Price block */
    priceBlock: { display: 'flex', flexDirection: 'column', gap: '6px' },
    priceRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    priceLabel: { fontSize: '13px', color: '#6B7280', minWidth: '60px' },
    priceMrp: { fontSize: '14px', color: '#9CA3AF', textDecoration: 'line-through' },
    priceValue: { fontSize: '28px', fontWeight: '800', color: '#111111', letterSpacing: '-0.8px' },
    priceDiscount: {
        fontSize: '13px', fontWeight: '700', color: '#16A34A',
        backgroundColor: '#F0FDF4', padding: '3px 8px', borderRadius: '4px',
    },
    taxNote: { fontSize: '12px', color: '#9CA3AF', margin: 0 },

    /* Stock */
    stockRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    stockLabel: { fontSize: '13px', color: '#6B7280', minWidth: '90px' },
    stockValue: { fontSize: '14px', fontWeight: '600' },

    shortDesc: { fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: 0 },

    /* Cart section */
    cartSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    qtyLabel: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    qtyControls: { display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden' },
    qtyBtn: {
        width: '36px', height: '36px', border: 'none',
        backgroundColor: '#F4F4F4', cursor: 'pointer',
        fontSize: '16px', fontWeight: '700', color: '#111111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'inherit',
    },
    qtyValue: {
        width: '44px', textAlign: 'center',
        fontSize: '15px', fontWeight: '700', color: '#111111',
        borderLeft: '1px solid #E5E5E5', borderRight: '1px solid #E5E5E5',
        height: '36px', lineHeight: '36px',
    },
    cartMsg: {
        padding: '10px 14px', borderRadius: '8px',
        fontSize: '13px', fontWeight: '500',
    },
    addToCartBtn: {
        backgroundColor: '#111111', color: '#FFFFFF',
        border: 'none', padding: '14px 24px',
        borderRadius: '10px', fontSize: '15px', fontWeight: '700',
        fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '-0.2px',
    },

    /* Badges */
    badges: { display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' },
    badge: {
        display: 'flex', alignItems: 'center', gap: '6px',
        backgroundColor: '#F9FAFB', border: '1px solid #E5E5E5',
        padding: '7px 12px', borderRadius: '8px',
    },
    badgeIcon: { fontSize: '14px' },
    badgeText: { fontSize: '12px', fontWeight: '600', color: '#374151' },

    /* Tabs */
    tabsSection: {
        maxWidth: '1200px', margin: '0 auto',
        backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E5E5',
    },
    tabBar: {
        display: 'flex', borderBottom: '1px solid #E5E5E5',
        padding: '0 48px',
    },
    tabBtn: {
        background: 'none', border: 'none',
        borderBottom: '2px solid transparent',
        padding: '16px 20px', fontSize: '14px',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'color 0.15s',
    },
    tabContent: {
        padding: '40px 48px',
    },

    /* Description tab */
    descFeatures: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '18px',
    },
    descFeatTitle: { fontSize: '16px', fontWeight: '700', color: '#111111', margin: '0 0 16px' },
    descTable: {
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #D5D9D9',
        fontSize: '14px',
    },
    descKey: {
        width: '260px',
        padding: '12px 16px',
        color: '#565959',
        fontWeight: '700',
        borderBottom: '1px solid #D5D9D9',
        verticalAlign: 'top',
    },
    descVal: {
        padding: '12px 16px',
        color: '#111111',
        borderBottom: '1px solid #D5D9D9',
        lineHeight: '1.55',
        verticalAlign: 'top',
    },
    descFeaturePill: {
        backgroundColor: '#F4F4F4',
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
        color: '#374151',
        fontSize: '13px',
        fontWeight: '600',
        padding: '9px 12px',
    },

    /* Specs table — Amazon style */
    specsTitle: { fontSize: '18px', fontWeight: '700', color: '#111111', margin: '0 0 20px', letterSpacing: '-0.3px' },
    specsTable: {
        width: '100%', borderCollapse: 'collapse',
        border: '1px solid #E5E5E5', borderRadius: '10px',
        overflow: 'hidden', fontSize: '14px',
    },
    specKey: {
        padding: '13px 20px', fontWeight: '600', color: '#374151',
        width: '220px', backgroundColor: 'inherit',
        borderBottom: '1px solid #E5E5E5', verticalAlign: 'top',
    },
    specVal: {
        padding: '13px 20px', color: '#111111',
        borderBottom: '1px solid #E5E5E5', verticalAlign: 'top',
    },
    specsNote: {
        marginTop: '16px', padding: '12px 16px',
        backgroundColor: '#F9FAFB', border: '1px solid #E5E5E5',
        borderRadius: '8px', fontSize: '13px', color: '#6B7280',
        lineHeight: '1.5',
    },

    /* Delivery tab */
    deliveryGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    deliveryCard: {
        backgroundColor: '#F9FAFB', border: '1px solid #E5E5E5',
        borderRadius: '12px', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '8px',
    },
    deliveryIcon: { fontSize: '24px' },
    deliveryTitle: { fontSize: '15px', fontWeight: '700', color: '#111111' },
    deliveryDesc: { fontSize: '13px', color: '#6B7280', lineHeight: '1.6' },
};

export default ProductDetail;
