import React from 'react'

import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    const [page, setPage] = useState('login');

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
                ? <Login onNavigate={setPage} />
                : <Register onNavigate={setPage} />}
        </div>
    );
}

export default App;