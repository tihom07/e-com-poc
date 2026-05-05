import React from 'react'

import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {

    const getInitialPage = () => {
        const token = localStorage.getItem('token');
        return token ? 'dashboard' : 'login';
    };

    const [page, setPage] = useState(getInitialPage);

    const handleNavigate = (newPage) => {
        setPage(newPage);
    };

    // Dashboard has no top nav — clean protected page
    if (page === 'dashboard') {
        return <Dashboard onNavigate={handleNavigate} />;
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <button
                    onClick={() => setPage('login')}
                    style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: page === 'login' ? '#4f46e5' : '#e2e8f0',
                        color: page === 'login' ? '#ffffff' : '#4a5568',
                        fontWeight: '500'
                    }}
                >
                    Login
                </button>
                <button
                    onClick={() => setPage('register')}
                    style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: page === 'register' ? '#4f46e5' : '#e2e8f0',
                        color: page === 'register' ? '#ffffff' : '#4a5568',
                        fontWeight: '500'
                    }}
                >
                    Register
                </button>
            </div>

            {page === 'login'
                ? <Login onNavigate={handleNavigate} />
                : <Register onNavigate={handleNavigate} />}
        </div>
    );
}

export default App;