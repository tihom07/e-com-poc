import { useState, useEffect } from 'react';
import { checkout } from '../api/orderApi';
import { getCart } from '../api/cartApi';

const Checkout = ({ onBack, onOrderSuccess }) => {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: ''
    });

    const [errors, setErrors] = useState({});

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim())
            newErrors.fullName = 'Full name is required';
        if (!formData.phone.trim())
            newErrors.phone = 'Phone is required';
        else if (!/^[0-9]{10}$/.test(formData.phone))
            newErrors.phone = 'Enter valid 10 digit phone number';
        if (!formData.addressLine.trim())
            newErrors.addressLine = 'Address is required';
        if (!formData.city.trim())
            newErrors.city = 'City is required';
        if (!formData.state.trim())
            newErrors.state = 'State is required';
        if (!formData.pincode.trim())
            newErrors.pincode = 'Pincode is required';
        else if (!/^[0-9]{6}$/.test(formData.pincode))
            newErrors.pincode = 'Enter valid 6 digit pincode';
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.paymentMethod)
            newErrors.paymentMethod = 'Please select a payment method';
        return newErrors;
    };

    const handleNextStep = () => {
        if (step === 1) {
            const validationErrors = validateStep1();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }
        if (step === 2) {
            const validationErrors = validateStep2();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePlaceOrder = async () => {
        setPlacing(true);
        setError('');
        try {
            const order = await checkout(formData);
            onOrderSuccess(order);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
            setStep(1);
        } finally {
            setPlacing(false);
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading...</p>
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

            <h2 style={styles.title}>Checkout</h2>

            {/* Step Indicator */}
            <div style={styles.stepIndicator}>
                {['Delivery Address', 'Payment', 'Review'].map((label, index) => (
                    <div key={index} style={styles.stepItem}>
                        <div style={{
                            ...styles.stepCircle,
                            backgroundColor: step > index + 1
                                ? '#48bb78'
                                : step === index + 1
                                    ? '#4f46e5'
                                    : '#e2e8f0',
                            color: step >= index + 1 ? '#ffffff' : '#a0aec0',
                        }}>
                            {step > index + 1 ? '✓' : index + 1}
                        </div>
                        <span style={{
                            ...styles.stepLabel,
                            color: step === index + 1 ? '#4f46e5' : '#a0aec0',
                            fontWeight: step === index + 1 ? '600' : '400',
                        }}>
                            {label}
                        </span>
                        {index < 2 && (
                            <div style={{
                                ...styles.stepLine,
                                backgroundColor: step > index + 1 ? '#48bb78' : '#e2e8f0',
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div style={styles.errorBox}>{error}</div>
            )}

            <div style={styles.layout}>

                {/* Left — Form */}
                <div style={styles.formSection}>

                    {/* Step 1 — Address */}
                    {step === 1 && (
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>
                                📍 Delivery Address
                            </h3>

                            <div style={styles.formGrid}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Full Name</label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.fullName
                                                ? '#e53e3e' : '#e2e8f0'
                                        }}
                                    />
                                    {errors.fullName && (
                                        <span style={styles.error}>
                                            {errors.fullName}
                                        </span>
                                    )}
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Phone Number</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10 digit number"
                                        maxLength={10}
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.phone
                                                ? '#e53e3e' : '#e2e8f0'
                                        }}
                                    />
                                    {errors.phone && (
                                        <span style={styles.error}>
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Address Line
                                </label>
                                <textarea
                                    name="addressLine"
                                    value={formData.addressLine}
                                    onChange={handleChange}
                                    placeholder="House No, Street, Area"
                                    rows={3}
                                    style={{
                                        ...styles.textarea,
                                        borderColor: errors.addressLine
                                            ? '#e53e3e' : '#e2e8f0'
                                    }}
                                />
                                {errors.addressLine && (
                                    <span style={styles.error}>
                                        {errors.addressLine}
                                    </span>
                                )}
                            </div>

                            <div style={styles.formGrid}>
                                <div style={styles.field}>
                                    <label style={styles.label}>City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Mumbai"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.city
                                                ? '#e53e3e' : '#e2e8f0'
                                        }}
                                    />
                                    {errors.city && (
                                        <span style={styles.error}>
                                            {errors.city}
                                        </span>
                                    )}
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>State</label>
                                    <input
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Maharashtra"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.state
                                                ? '#e53e3e' : '#e2e8f0'
                                        }}
                                    />
                                    {errors.state && (
                                        <span style={styles.error}>
                                            {errors.state}
                                        </span>
                                    )}
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Pincode</label>
                                    <input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="400001"
                                        maxLength={6}
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.pincode
                                                ? '#e53e3e' : '#e2e8f0'
                                        }}
                                    />
                                    {errors.pincode && (
                                        <span style={styles.error}>
                                            {errors.pincode}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleNextStep}
                                style={styles.nextBtn}
                            >
                                Continue to Payment →
                            </button>
                        </div>
                    )}

                    {/* Step 2 — Payment */}
                    {step === 2 && (
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>
                                💳 Payment Method
                            </h3>

                            <div style={styles.paymentOptions}>

                                {[
                                    {
                                        id: 'COD',
                                        label: 'Cash on Delivery',
                                        icon: '💵',
                                        desc: 'Pay when your order arrives'
                                    },
                                    {
                                        id: 'UPI',
                                        label: 'UPI Payment',
                                        icon: '📱',
                                        desc: 'GPay, PhonePe, Paytm'
                                    },
                                    {
                                        id: 'CARD',
                                        label: 'Credit / Debit Card',
                                        icon: '💳',
                                        desc: 'Visa, Mastercard, RuPay'
                                    },
                                    {
                                        id: 'NETBANKING',
                                        label: 'Net Banking',
                                        icon: '🏦',
                                        desc: 'All major banks supported'
                                    }
                                ].map(option => (
                                    <div
                                        key={option.id}
                                        style={{
                                            ...styles.paymentOption,
                                            borderColor: formData.paymentMethod === option.id
                                                ? '#4f46e5' : '#e2e8f0',
                                            backgroundColor: formData.paymentMethod === option.id
                                                ? '#f5f3ff' : '#ffffff',
                                        }}
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                paymentMethod: option.id
                                            });
                                            setErrors({
                                                ...errors,
                                                paymentMethod: ''
                                            });
                                        }}
                                    >
                                        <span style={styles.paymentIcon}>
                                            {option.icon}
                                        </span>
                                        <div style={styles.paymentInfo}>
                                            <p style={styles.paymentLabel}>
                                                {option.label}
                                            </p>
                                            <p style={styles.paymentDesc}>
                                                {option.desc}
                                            </p>
                                        </div>
                                        <div style={{
                                            ...styles.radioCircle,
                                            borderColor: formData.paymentMethod === option.id
                                                ? '#4f46e5' : '#e2e8f0',
                                            backgroundColor: formData.paymentMethod === option.id
                                                ? '#4f46e5' : '#ffffff',
                                        }} />
                                    </div>
                                ))}
                            </div>

                            {errors.paymentMethod && (
                                <span style={styles.error}>
                                    {errors.paymentMethod}
                                </span>
                            )}

                            <div style={styles.btnRow}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={styles.prevBtn}
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    style={styles.nextBtn}
                                >
                                    Review Order →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Review */}
                    {step === 3 && (
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>
                                📋 Review Your Order
                            </h3>

                            {/* Address Review */}
                            <div style={styles.reviewSection}>
                                <div style={styles.reviewHeader}>
                                    <span style={styles.reviewLabel}>
                                        📍 Delivery Address
                                    </span>
                                    <button
                                        onClick={() => setStep(1)}
                                        style={styles.editBtn}
                                    >
                                        Edit
                                    </button>
                                </div>
                                <p style={styles.reviewText}>
                                    {formData.fullName}
                                </p>
                                <p style={styles.reviewText}>
                                    {formData.phone}
                                </p>
                                <p style={styles.reviewText}>
                                    {formData.addressLine}
                                </p>
                                <p style={styles.reviewText}>
                                    {formData.city}, {formData.state} — {formData.pincode}
                                </p>
                            </div>

                            {/* Payment Review */}
                            <div style={styles.reviewSection}>
                                <div style={styles.reviewHeader}>
                                    <span style={styles.reviewLabel}>
                                        💳 Payment Method
                                    </span>
                                    <button
                                        onClick={() => setStep(2)}
                                        style={styles.editBtn}
                                    >
                                        Edit
                                    </button>
                                </div>
                                <p style={styles.reviewText}>
                                    {formData.paymentMethod === 'COD' && '💵 Cash on Delivery'}
                                    {formData.paymentMethod === 'UPI' && '📱 UPI Payment'}
                                    {formData.paymentMethod === 'CARD' && '💳 Credit / Debit Card'}
                                    {formData.paymentMethod === 'NETBANKING' && '🏦 Net Banking'}
                                </p>
                            </div>

                            {/* Items Review */}
                            <div style={styles.reviewSection}>
                                <span style={styles.reviewLabel}>
                                    🛒 Items ({cart.items.length})
                                </span>
                                {cart.items.map(item => (
                                    <div key={item.id} style={styles.reviewItem}>
                                        <span style={styles.reviewItemName}>
                                            {item.product.name}
                                        </span>
                                        <span style={styles.reviewItemQty}>
                                            x{item.quantity}
                                        </span>
                                        <span style={styles.reviewItemPrice}>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.btnRow}>
                                <button
                                    onClick={() => setStep(2)}
                                    style={styles.prevBtn}
                                >
                                    ← Back
                                </button>
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
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Order Summary */}
                <div style={styles.summarySection}>
                    <h3 style={styles.summaryTitle}>Order Summary</h3>

                    {cart.items.map(item => (
                        <div key={item.id} style={styles.summaryItem}>
                            <div style={styles.summaryItemLeft}>
                                <div style={styles.summaryImageBox}>
                                    {item.product.imageUrl ? (
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            style={styles.summaryImage}
                                        />
                                    ) : (
                                        <span>🖼️</span>
                                    )}
                                </div>
                                <div>
                                    <p style={styles.summaryItemName}>
                                        {item.product.name}
                                    </p>
                                    <p style={styles.summaryItemQty}>
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <p style={styles.summaryItemPrice}>
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}

                    <div style={styles.divider} />

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
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#4f46e5'
                        }}>
                            ${cart.totalPrice?.toFixed(2)}
                        </span>
                    </div>

                    <div style={styles.infoBox}>
                        <p style={styles.infoText}>
                            📦 Order placed immediately
                        </p>
                        <p style={styles.infoText}>
                            🔄 Stock updated automatically
                        </p>
                        <p style={styles.infoText}>
                            🛒 Cart cleared after order
                        </p>
                    </div>
                </div>
            </div>
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
    stepIndicator: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '0',
    },
    stepItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
    },
    stepCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        minWidth: '32px',
    },
    stepLabel: {
        fontSize: '13px',
        whiteSpace: 'nowrap',
    },
    stepLine: {
        flex: 1,
        height: '2px',
        marginLeft: '8px',
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
    formSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    formTitle: {
        fontSize: '17px',
        fontWeight: '600',
        color: '#1a202c',
        margin: '0 0 20px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '16px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#4a5568',
    },
    input: {
        padding: '10px 14px',
        fontSize: '14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        color: '#1a202c',
    },
    textarea: {
        padding: '10px 14px',
        fontSize: '14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        color: '#1a202c',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    error: {
        fontSize: '12px',
        color: '#e53e3e',
    },
    paymentOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px',
    },
    paymentOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    paymentIcon: {
        fontSize: '24px',
    },
    paymentInfo: {
        flex: 1,
    },
    paymentLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a202c',
        margin: 0,
    },
    paymentDesc: {
        fontSize: '12px',
        color: '#718096',
        margin: 0,
    },
    radioCircle: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: '2px solid #e2e8f0',
        minWidth: '18px',
    },
    btnRow: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    nextBtn: {
        flex: 1,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
    },
    prevBtn: {
        backgroundColor: 'transparent',
        color: '#4a5568',
        border: '1.5px solid #e2e8f0',
        padding: '12px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
    },
    placeOrderBtn: {
        flex: 1,
        backgroundColor: '#48bb78',
        color: '#ffffff',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
    },
    reviewSection: {
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    reviewLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#4a5568',
    },
    editBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4f46e5',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
    },
    reviewText: {
        fontSize: '14px',
        color: '#2d3748',
        margin: '2px 0',
    },
    reviewItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px',
    },
    reviewItemName: {
        fontSize: '13px',
        color: '#2d3748',
        flex: 1,
    },
    reviewItemQty: {
        fontSize: '13px',
        color: '#718096',
    },
    reviewItemPrice: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#4f46e5',
    },
    summarySection: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: '24px',
    },
    summaryTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 16px',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    summaryItemLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    summaryImageBox: {
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        backgroundColor: '#f7fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    summaryImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    summaryItemName: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#2d3748',
        margin: 0,
    },
    summaryItemQty: {
        fontSize: '11px',
        color: '#a0aec0',
        margin: 0,
    },
    summaryItemPrice: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#4f46e5',
        margin: 0,
    },
    divider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '12px 0',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    summaryLabel: {
        fontSize: '13px',
        color: '#718096',
    },
    summaryValue: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2d3748',
    },
    infoBox: {
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    infoText: {
        fontSize: '12px',
        color: '#4a5568',
        margin: 0,
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