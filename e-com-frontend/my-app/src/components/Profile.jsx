import { useState, useEffect } from 'react';
import { getProfile, updateProfile, updatePassword } from '../api/profileApi';

const Profile = ({ onBack }) => {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await getProfile();
            setProfile(data);
            setProfileForm({
                name: data.name || '',
                phone: data.phone || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
        setProfileErrors({ ...profileErrors, [e.target.name]: '' });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        setPasswordErrors({ ...passwordErrors, [e.target.name]: '' });
    };

    const validateProfile = () => {
        const errors = {};
        if (!profileForm.name.trim())
            errors.name = 'Name is required';
        if (profileForm.phone && !/^[0-9]{10}$/.test(profileForm.phone))
            errors.phone = 'Enter valid 10 digit phone number';
        return errors;
    };

    const validatePassword = () => {
        const errors = {};
        if (!passwordForm.currentPassword)
            errors.currentPassword = 'Current password is required';
        if (!passwordForm.newPassword)
            errors.newPassword = 'New password is required';
        else if (passwordForm.newPassword.length < 6)
            errors.newPassword = 'Password must be at least 6 characters';
        if (!passwordForm.confirmPassword)
            errors.confirmPassword = 'Please confirm your new password';
        else if (passwordForm.newPassword !== passwordForm.confirmPassword)
            errors.confirmPassword = 'Passwords do not match';
        return errors;
    };

    const handleProfileSubmit = async () => {
        const errors = validateProfile();
        if (Object.keys(errors).length > 0) {
            setProfileErrors(errors);
            return;
        }
        setProfileLoading(true);
        setProfileMessage('');
        try {
            const data = await updateProfile(profileForm);
            setProfileMessage('✅ Profile updated successfully');
            localStorage.setItem('name', data.name);
            fetchProfile();
        } catch (error) {
            setProfileMessage(`❌ ${error.response?.data?.error || 'Failed to update profile'}`);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        const errors = validatePassword();
        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }
        setPasswordLoading(true);
        setPasswordMessage('');
        try {
            await updatePassword(passwordForm);
            setPasswordMessage('✅ Password updated successfully');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setPasswordMessage(`❌ ${error.response?.data?.error || 'Failed to update password'}`);
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={styles.loadingText}>Loading profile...</p>
        </div>
    );

    return (
        <div style={styles.container}>

            <button onClick={onBack} style={styles.backBtn}>
                ← Back to Products
            </button>

            <h2 style={styles.title}>👤 My Profile</h2>

            {/* Profile Info Card */}
            <div style={styles.profileCard}>
                <div style={styles.avatar}>
                    {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p style={styles.profileName}>{profile?.name}</p>
                    <p style={styles.profileEmail}>{profile?.email}</p>
                    <span style={styles.roleBadge}>
                        {profile?.role === 'ADMIN' ? '⚙️ Admin' : '🛍️ Customer'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                        ...styles.tab,
                        borderBottom: activeTab === 'profile'
                            ? '2px solid #4f46e5' : '2px solid transparent',
                        color: activeTab === 'profile' ? '#4f46e5' : '#718096',
                    }}
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    style={{
                        ...styles.tab,
                        borderBottom: activeTab === 'password'
                            ? '2px solid #4f46e5' : '2px solid transparent',
                        color: activeTab === 'password' ? '#4f46e5' : '#718096',
                    }}
                >
                    Change Password
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div style={styles.formCard}>

                    {profileMessage && (
                        <div style={{
                            ...styles.messageBox,
                            backgroundColor: profileMessage.includes('❌')
                                ? '#fff5f5' : '#f0fff4',
                            border: `1px solid ${profileMessage.includes('❌')
                                ? '#feb2b2' : '#9ae6b4'}`,
                            color: profileMessage.includes('❌')
                                ? '#c53030' : '#276749',
                        }}>
                            {profileMessage}
                        </div>
                    )}

                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            placeholder="John Doe"
                            style={{
                                ...styles.input,
                                borderColor: profileErrors.name ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {profileErrors.name && (
                            <span style={styles.error}>{profileErrors.name}</span>
                        )}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            value={profile?.email}
                            disabled
                            style={{
                                ...styles.input,
                                backgroundColor: '#f7fafc',
                                color: '#a0aec0',
                                cursor: 'not-allowed'
                            }}
                        />
                        <span style={styles.hint}>
                            Email cannot be changed
                        </span>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Phone Number</label>
                        <input
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            placeholder="10 digit number"
                            maxLength={10}
                            style={{
                                ...styles.input,
                                borderColor: profileErrors.phone ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {profileErrors.phone && (
                            <span style={styles.error}>{profileErrors.phone}</span>
                        )}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Address</label>
                        <textarea
                            name="address"
                            value={profileForm.address}
                            onChange={handleProfileChange}
                            placeholder="Your address"
                            rows={3}
                            style={styles.textarea}
                        />
                    </div>

                    <button
                        onClick={handleProfileSubmit}
                        disabled={profileLoading}
                        style={{
                            ...styles.saveBtn,
                            opacity: profileLoading ? 0.7 : 1,
                            cursor: profileLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                    </button>

                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div style={styles.formCard}>

                    {passwordMessage && (
                        <div style={{
                            ...styles.messageBox,
                            backgroundColor: passwordMessage.includes('❌')
                                ? '#fff5f5' : '#f0fff4',
                            border: `1px solid ${passwordMessage.includes('❌')
                                ? '#feb2b2' : '#9ae6b4'}`,
                            color: passwordMessage.includes('❌')
                                ? '#c53030' : '#276749',
                        }}>
                            {passwordMessage}
                        </div>
                    )}

                    <div style={styles.field}>
                        <label style={styles.label}>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            style={{
                                ...styles.input,
                                borderColor: passwordErrors.currentPassword
                                    ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {passwordErrors.currentPassword && (
                            <span style={styles.error}>
                                {passwordErrors.currentPassword}
                            </span>
                        )}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Min 6 characters"
                            style={{
                                ...styles.input,
                                borderColor: passwordErrors.newPassword
                                    ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {passwordErrors.newPassword && (
                            <span style={styles.error}>
                                {passwordErrors.newPassword}
                            </span>
                        )}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Repeat new password"
                            style={{
                                ...styles.input,
                                borderColor: passwordErrors.confirmPassword
                                    ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {passwordErrors.confirmPassword && (
                            <span style={styles.error}>
                                {passwordErrors.confirmPassword}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handlePasswordSubmit}
                        disabled={passwordLoading}
                        style={{
                            ...styles.saveBtn,
                            opacity: passwordLoading ? 0.7 : 1,
                            cursor: passwordLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>

                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
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
    profileCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
    },
    avatar: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: '700',
        minWidth: '64px',
    },
    profileName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 4px',
    },
    profileEmail: {
        fontSize: '14px',
        color: '#718096',
        margin: '0 0 8px',
    },
    roleBadge: {
        fontSize: '12px',
        backgroundColor: '#ede9fe',
        color: '#4f46e5',
        padding: '3px 10px',
        borderRadius: '20px',
        fontWeight: '500',
    },
    tabs: {
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '24px',
    },
    tab: {
        padding: '12px 24px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    messageBox: {
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
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
    hint: {
        fontSize: '11px',
        color: '#a0aec0',
    },
    saveBtn: {
        width: '100%',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        marginTop: '8px',
    },
    loadingText: {
        color: '#718096',
        fontSize: '16px',
    },
};

export default Profile;