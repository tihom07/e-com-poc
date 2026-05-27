import { useState } from 'react';
import { loginUser } from '../api/login';

export default function Login({ onNavigate }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const e = {};
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
        if (!formData.password) e.password = 'Password is required';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length > 0) { setErrors(ve); return; }
        setLoading(true); setErrors({});
        try {
            const data = await loginUser(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', data.role);
            onNavigate(data.role === 'ADMIN' ? 'admin' : 'dashboard');
        } catch (error) {
            if (error.response?.data) setErrors(error.response.data);
            else setErrors({ general: 'Invalid credentials. Please try again.' });
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>

            {/* LEFT — dark brand panel */}
            <div style={s.left}>
                <div style={s.leftInner}>
                    <div style={s.brand}>STRIDE</div>

                    <div style={s.leftMiddle}>
                        <div style={s.quoteMarks}>"</div>
                        <p style={s.quoteText}>
                            The right shoe changes how you carry yourself through the world.
                        </p>
                        <div style={s.quotePerson}>
                            <div style={s.quoteAvatar}>SL</div>
                            <div>
                                <div style={s.quoteAuthor}>Stride</div>
                                <div style={s.quoteRole}>Premium Sneaker Store</div>
                            </div>
                        </div>
                    </div>

                    <div style={s.leftBottom}>
                        <div style={s.leftBottomLine} />
                        <p style={s.leftBottomText}>Curated sneakers. Delivered.</p>
                    </div>
                </div>
            </div>

            {/* RIGHT — form panel */}
            <div style={s.right}>
                <div style={s.rightTopNav}>
                    New to Stride?{' '}
                    <span style={s.rightNavLink} onClick={() => onNavigate('register')}>
                        Create account →
                    </span>
                </div>

                <div style={s.formWrap}>
                    <div style={s.formHead}>
                        <div style={s.formChip}>
                            <span style={s.chipDot} />
                            Welcome back
                        </div>
                        <h1 style={s.formTitle}>Sign in to Stride</h1>
                        <p style={s.formSub}>Your collection is waiting</p>
                    </div>

                    {(errors.general || errors.error) && (
                        <div style={s.errBox}>{errors.general || errors.error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={s.form}>
                        <div style={s.field}>
                            <label style={s.label}>Email address</label>
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="you@example.com"
                                style={{ ...s.input, borderColor: errors.email ? '#DC2626' : '#E5E5E5' }}
                            />
                            {errors.email && <span style={s.fieldErr}>{errors.email}</span>}
                        </div>

                        <div style={s.field}>
                            <label style={s.label}>Password</label>
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••••"
                                style={{ ...s.input, borderColor: errors.password ? '#DC2626' : '#E5E5E5' }}
                            />
                            {errors.password && <span style={s.fieldErr}>{errors.password}</span>}
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Signing in…' : 'Sign in'}
                            {!loading && <span style={s.btnArrow}>↗</span>}
                        </button>
                    </form>

                    <p style={s.switchText}>
                        No account yet?{' '}
                        <span style={s.switchLink} onClick={() => onNavigate('register')}>
                            Join Stride
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" },
    left: {
        flex: '0 0 44%',
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
    },
    leftInner: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
    },
    brand: {
        fontSize: '13px', fontWeight: '800',
        letterSpacing: '5px', color: '#FFFFFF',
    },
    leftMiddle: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '40px' },
    quoteMarks: { fontSize: '72px', fontWeight: '900', color: '#333333', lineHeight: '0.7', marginBottom: '24px' },
    quoteText: { fontSize: '22px', fontWeight: '500', color: '#FFFFFF', lineHeight: '1.45', letterSpacing: '-0.3px', margin: '0 0 32px' },
    quotePerson: { display: 'flex', alignItems: 'center', gap: '12px' },
    quoteAvatar: {
        width: '44px', height: '44px', borderRadius: '50%',
        backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '13px', fontWeight: '800',
        color: '#111111', minWidth: '44px',
    },
    quoteAuthor: { fontSize: '14px', fontWeight: '700', color: '#FFFFFF' },
    quoteRole: { fontSize: '12px', color: '#6B7280', marginTop: '2px' },
    leftBottom: { paddingTop: '32px', borderTop: '1px solid #222222' },
    leftBottomLine: { width: '32px', height: '2px', backgroundColor: '#FFFFFF', marginBottom: '12px' },
    leftBottomText: { fontSize: '13px', color: '#6B7280', margin: 0, letterSpacing: '0.3px' },

    right: { flex: 1, backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column' },
    rightTopNav: {
        padding: '18px 48px', textAlign: 'right',
        fontSize: '13px', color: '#6B7280',
        borderBottom: '1px solid #E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    rightNavLink: { color: '#111111', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' },
    formWrap: {
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 64px',
        maxWidth: '460px', margin: '0 auto', width: '100%',
    },
    formHead: { marginBottom: '36px' },
    formChip: {
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        backgroundColor: '#F4F4F4', border: '1px solid #E5E5E5',
        fontSize: '12px', fontWeight: '600', color: '#374151',
        padding: '5px 12px', borderRadius: '20px', marginBottom: '16px',
    },
    chipDot: { display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#111111' },
    formTitle: { fontSize: '32px', fontWeight: '800', color: '#111111', margin: '0 0 6px', letterSpacing: '-0.8px' },
    formSub: { fontSize: '14px', color: '#6B7280', margin: 0 },
    errBox: {
        backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
        color: '#991B1B', padding: '12px 16px', borderRadius: '10px',
        fontSize: '13px', marginBottom: '20px',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
    input: {
        padding: '13px 16px', fontSize: '15px',
        border: '1.5px solid #E5E5E5', borderRadius: '10px',
        outline: 'none', color: '#111111', backgroundColor: '#FFFFFF',
        fontFamily: 'inherit', transition: 'border-color 0.15s',
    },
    fieldErr: { fontSize: '12px', color: '#DC2626', fontWeight: '500' },
    btn: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        backgroundColor: '#111111', color: '#FFFFFF',
        padding: '14px 24px', fontSize: '15px', fontWeight: '700',
        border: 'none', borderRadius: '10px', cursor: 'pointer',
        marginTop: '4px', fontFamily: 'inherit',
    },
    btnArrow: {
        backgroundColor: '#FFFFFF', color: '#111111',
        width: '24px', height: '24px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: '900',
    },
    switchText: { fontSize: '13px', color: '#9CA3AF', textAlign: 'center', marginTop: '24px' },
    switchLink: { color: '#111111', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' },
};