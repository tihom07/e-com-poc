import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

function App() {
    const getInitialPage = () => {
        const token = localStorage.getItem('token');
        if (!token) return 'login';
        const role = localStorage.getItem('role');
        return role === 'ADMIN' ? 'admin' : 'dashboard';
    };

    const [page, setPage] = useState(getInitialPage);

    const handleNavigate = (newPage) => setPage(newPage);

    if (page === 'admin') return <AdminDashboard onNavigate={handleNavigate} />;
    if (page === 'dashboard') return <UserDashboard onNavigate={handleNavigate} />;

    // No top nav buttons — login/register switch happens INSIDE each page
    return page === 'login'
        ? <Login onNavigate={handleNavigate} />
        : <Register onNavigate={handleNavigate} />;
}

export default App;