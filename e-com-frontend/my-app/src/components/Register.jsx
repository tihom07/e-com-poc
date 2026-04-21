import { useState } from 'react';
import { registerUser } from '../api/auth';

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
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
        if (!formData.name.trim())
            newErrors.name = 'Name is required';
        if (!formData.email.trim())
            newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Enter a valid email';
        if (!formData.password)
            newErrors.password = 'Password is required';
        else if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';
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
            await registerUser(formData);
            setSuccessMessage('Account created successfully!');
            setFormData({ name: '', email: '', password: '' });
        } catch (error) {
            console.log('Error response:', error.response);

            if (error.response && error.response.data) {
                const data = error.response.data;

                // Handle "Email already registered" string error
                if (typeof data === 'string') {
                    setErrors({ general: data });

                // Handle { error: "Email already registered" } object
                } else if (data.error) {
                    setErrors({ general: data.error });

                // Handle field validation errors like { email: "..." }
                } else {
                    setErrors(data);
                }
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
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Fill in the details below to register</p>

                {successMessage && (
                    <div style={styles.success}>{successMessage}</div>
                )}

                {errors.general && (
                    <div style={styles.errorBox}>{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.field}>
                        <label style={styles.label}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            style={{
                                ...styles.input,
                                borderColor: errors.name ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {errors.name && <span style={styles.error}>{errors.name}</span>}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
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
                            placeholder="Password (Min 6 characters)"
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
                        {loading ? 'Creating account...' : 'Register'}
                    </button>

                </form>
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
        transition: 'border-color 0.2s',
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
};

export default Register;