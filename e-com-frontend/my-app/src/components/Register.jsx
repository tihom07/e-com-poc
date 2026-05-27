import { useState } from 'react';
import { registerUser } from '../api/auth';

export default function Register({ onNavigate }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Name is required';
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length > 0) { setErrors(ve); return; }
        setLoading(true); setErrors({}); setSuccess('');
        try {
            await registerUser(formData);
            setSuccess('Account created! Redirecting to login…');
            setFormData({ name: '', email: '', password: '' });
            setTimeout(() => onNavigate('login'), 1800);
        } catch (error) {
            if (error.response?.data) setErrors(error.response.data);
            else setErrors({ general: 'Something went wrong. Try again.' });
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>

            {/* LEFT */}
            <div style={s.left}>
                <div style={s.leftInner}>
                    <div style={s.brand}>STRIDE</div>

                    <div style={s.leftMiddle}>
                        <h2 style={s.leftH2}>
                            Find your<br />
                            <span style={s.leftH2White}>perfect pair.</span>
                        </h2>
                        <p style={s.leftDesc}>
                            Premium sneakers curated for every style,
                            every street, every story.
                        </p>
                        <div style={s.pillRow}>
                            {['Free returns', 'Authentic only', 'Fast delivery'].map(p => (
                                <div key={p} style={s.pill}>{p}</div>
                            ))}
                        </div>
                    </div>

                    <div style={s.leftBottom}>
                        <div style={s.leftBottomLine} />
                        <p style={s.leftBottomText}>Join thousands of sneaker enthusiasts</p>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div style={s.right}>
                <div style={s.rightTopNav}>
                    Already have an account?{' '}
                    <span style={s.rightNavLink} onClick={() => onNavigate('login')}>
                        Sign in →
                    </span>
                </div>

                <div style={s.formWrap}>
                    <div style={s.formHead}>
                        <div style={s.formChip}>Create account</div>
                        <h1 style={s.formTitle}>Join Stride</h1>
                        <p style={s.formSub}>Your next favourite pair is one step away</p>
                    </div>

                    {success && <div style={s.successBox}>{success}</div>}
                    {(errors.general || errors.error) && (
                        <div style={s.errBox}>{errors.general || errors.error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={s.form}>
                        {[
                            { name: 'name', label: 'Full name', type: 'text', ph: 'Jordan Lee' },
                            { name: 'email', label: 'Email address', type: 'email', ph: 'you@example.com' },
                            { name: 'password', label: 'Password', type: 'password', ph: 'Min. 6 characters' },
                        ].map(f => (
                            <div key={f.name} style={s.field}>
                                <label style={s.label}>{f.label}</label>
                                <input
                                    type={f.type} name={f.name}
                                    value={formData[f.name]} onChange={handleChange}
                                    placeholder={f.ph}
                                    style={{ ...s.input, borderColor: errors[f.name] ? '#DC2626' : '#E5E5E5' }}
                                />
                                {errors[f.name] && <span style={s.fieldErr}>{errors[f.name]}</span>}
                            </div>
                        ))}

                        <button type="submit" disabled={loading}
                            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Creating account…' : 'Create account'}
                            {!loading && <span style={s.btnArrow}>↗</span>}
                        </button>
                    </form>

                    <p style={s.switchText}>
                        Already a member?{' '}
                        <span style={s.switchLink} onClick={() => onNavigate('login')}>
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" },
    left: { flex: '0 0 44%', backgroundColor: '#111111', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    leftInner: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px' },
    brand: { fontSize: '13px', fontWeight: '800', letterSpacing: '5px', color: '#FFFFFF' },
    leftMiddle: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '40px' },
    leftH2: { fontSize: '52px', fontWeight: '800', color: '#444444', lineHeight: '1.05', letterSpacing: '-1.5px', margin: '0 0 20px' },
    leftH2White: { color: '#FFFFFF' },
    leftDesc: { fontSize: '15px', color: '#6B7280', lineHeight: '1.6', margin: '0 0 32px', maxWidth: '320px' },
    pillRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    pill: {
        backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A',
        color: '#9CA3AF', fontSize: '12px', fontWeight: '600',
        padding: '6px 14px', borderRadius: '20px', letterSpacing: '0.2px',
    },
    leftBottom: { paddingTop: '32px', borderTop: '1px solid #1A1A1A' },
    leftBottomLine: { width: '32px', height: '2px', backgroundColor: '#FFFFFF', marginBottom: '12px' },
    leftBottomText: { fontSize: '13px', color: '#6B7280', margin: 0 },

    right: { flex: 1, backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column' },
    rightTopNav: { padding: '18px 48px', textAlign: 'right', fontSize: '13px', color: '#6B7280', borderBottom: '1px solid #E5E5E5', backgroundColor: '#FFFFFF' },
    rightNavLink: { color: '#111111', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' },
    formWrap: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', maxWidth: '460px', margin: '0 auto', width: '100%' },
    formHead: { marginBottom: '36px' },
    formChip: {
        display: 'inline-block', backgroundColor: '#111111', color: '#FFFFFF',
        fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
        padding: '5px 14px', borderRadius: '20px', marginBottom: '16px',
        textTransform: 'uppercase',
    },
    formTitle: { fontSize: '32px', fontWeight: '800', color: '#111111', margin: '0 0 6px', letterSpacing: '-0.8px' },
    formSub: { fontSize: '14px', color: '#6B7280', margin: 0 },
    successBox: { backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' },
    errBox: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
    input: { padding: '13px 16px', fontSize: '15px', border: '1.5px solid #E5E5E5', borderRadius: '10px', outline: 'none', color: '#111111', backgroundColor: '#FFFFFF', fontFamily: 'inherit' },
    fieldErr: { fontSize: '12px', color: '#DC2626', fontWeight: '500' },
    btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#111111', color: '#FFFFFF', padding: '14px 24px', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '4px', fontFamily: 'inherit' },
    btnArrow: { backgroundColor: '#FFFFFF', color: '#111111', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' },
    switchText: { fontSize: '13px', color: '#9CA3AF', textAlign: 'center', marginTop: '24px' },
    switchLink: { color: '#111111', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' },
};