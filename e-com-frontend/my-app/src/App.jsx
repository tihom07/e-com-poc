import { useEffect, useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

const pagePaths = {
    login: '/login',
    register: '/registration',
    dashboard: '/dashboard',
    admin: '/admin',
};

const getCleanPath = () => {
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    return path || '/';
};

const getSignedInPage = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' ? 'admin' : 'dashboard';
};

const getPageFromPath = () => {
    const path = getCleanPath();
    const token = localStorage.getItem('token');

    if (path === '/registration' || path === '/register' || path === '/signup') {
        return 'register';
    }

    if (path === '/login') {
        return 'login';
    }

    if (path === '/admin') {
        return token ? getSignedInPage() : 'login';
    }

    if (path === '/dashboard' || path === '/home' || path === '/shop') {
        return token ? getSignedInPage() : 'login';
    }

    return token ? getSignedInPage() : 'login';
};

function App() {
    const [page, setPage] = useState(getPageFromPath);

    useEffect(() => {
        const handlePopState = () => setPage(getPageFromPath());

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleNavigate = (newPage) => {
        setPage(newPage);

        const nextPath = pagePaths[newPage] || pagePaths.login;
        if (window.location.pathname !== nextPath) {
            window.history.pushState({ page: newPage }, '', nextPath);
        }
    };

    if (page === 'admin') return <AdminDashboard onNavigate={handleNavigate} />;
    if (page === 'dashboard') return <UserDashboard onNavigate={handleNavigate} />;

    // No top nav buttons — login/register switch happens INSIDE each page
    return page === 'login'
        ? <Login onNavigate={handleNavigate} />
        : <Register onNavigate={handleNavigate} />;
}

export default App;
