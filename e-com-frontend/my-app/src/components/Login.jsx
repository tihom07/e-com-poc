import { useState } from 'react';
import { loginUser } from '../api/login';

const Login = ({ onNavigate }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim())
            newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Enter a valid email';
        if (!formData.password)
            newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const data = await loginUser(formData);
            // Save token to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', data.role);

            // Redirect based on role
            if (data.role === 'ADMIN') {
                onNavigate('admin');
            } else {
                onNavigate('dashboard');
            }
        } catch (error) {
            if (error.response?.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Login to your account</p>

                {successMessage && (
                    <div style={styles.success}>{successMessage}</div>
                )}

                {errors.general && (
                    <div style={styles.errorBox}>{errors.general}</div>
                )}

                {errors.error && (
                    <div style={styles.errorBox}>{errors.error}</div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {errors.email && <span style={styles.error}>{errors.email}</span>}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            style={{
                                ...styles.input,
                                borderColor: errors.password ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {errors.password && <span style={styles.error}>{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p style={styles.registerText}>
                    Don't have an account?{' '}
                    <span
                        style={styles.registerLink}
                        onClick={() => onNavigate('register')}
                    >
                        Register here
                    </span>
                </p>

            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7fafc',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '420px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1a202c',
        margin: '0 0 6px 0',
    },
    subtitle: {
        fontSize: '14px',
        color: '#718096',
        margin: '0 0 24px 0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '14px',
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
    error: {
        fontSize: '12px',
        color: '#e53e3e',
    },
    errorBox: {
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        color: '#c53030',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
    },
    success: {
        backgroundColor: '#f0fff4',
        border: '1px solid #9ae6b4',
        color: '#276749',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
    },
    button: {
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        padding: '12px',
        fontSize: '15px',
        fontWeight: '500',
        border: 'none',
        borderRadius: '8px',
        marginTop: '8px',
    },
    registerText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#718096',
        marginTop: '20px',
    },
    registerLink: {
        color: '#4f46e5',
        cursor: 'pointer',
        fontWeight: '500',
    },
};

export default Login;