import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Calendar, TrendingUp, LogOut, Search, Bell, Activity, X, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Sidebar = () => {
    const navigate = useNavigate();
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Patients', path: '/patients', icon: Users },
        { name: 'Appointments', path: '/appointments', icon: Calendar },
        { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
        { name: 'Revenue', path: '/reports', icon: TrendingUp },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="app-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Activity size={16} />
                    </div>
                    <span>RxConnect</span>
                </div>
            </div>

            <div className="sidebar-nav">
                <div className="sidebar-section-label">Main Menu</div>
                {navItems.map((item) => {
                    const IconStyle = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <IconStyle className="nav-item-icon" size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    )
                })}
            </div>

            <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                    className="nav-item btn-ghost"
                    style={{ width: '100%', textAlign: 'left', color: 'var(--color-danger)', border: 'none' }}
                    onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                >
                    <LogOut className="nav-item-icon" size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Breadcrumbs Logic
    const pathnames = location.pathname.split('/').filter((x) => x);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="app-header">
            {/* Breadcrumbs / View Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Workspace</span>
                <span style={{ color: 'var(--color-border-strong)' }}>/</span>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    return (
                        <div key={to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span
                                onClick={() => !last && navigate(to)}
                                style={{
                                    color: last ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                    fontWeight: last ? 700 : 400,
                                    cursor: last ? 'default' : 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {value}
                            </span>
                            {!last && <span style={{ color: 'var(--color-border-strong)' }}>/</span>}
                        </div>
                    );
                })}
            </div>

            {/* Right Cluster */}
            <div className="header-user">
                {/* Search (Compact) */}
                <div className="header-search" style={{ width: '240px', padding: '0.4rem 0.75rem' }}>
                    <Search size={14} color="var(--color-text-muted)" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        style={{ fontSize: '0.8rem' }}
                    />
                </div>

                <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 0.5rem' }}></div>

                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="header-icon-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ width: '32px', height: '32px', background: showNotifications ? 'var(--color-text-main)' : undefined, color: showNotifications ? 'var(--color-bg)' : undefined }}
                    >
                        <Bell size={16} />
                    </button>

                    {showNotifications && (
                        <div className="dropdown-panel" style={{ width: '320px', top: 'calc(100% + 12px)' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Notifications</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="badge badge-primary">2 New</span>
                                    <button className="btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setShowNotifications(false)}>
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                {[
                                    { title: 'Online Booking', body: 'Sneha Patel booked Tomorrow 10:30 AM', time: '10 mins ago', isNew: true },
                                    { title: 'Lab Results Ready', body: 'Blood report for Rahul Sharma ready.', time: '2 hours ago', isNew: true },
                                ].map((notif, i) => (
                                    <div key={i} style={{
                                        padding: '1rem',
                                        borderBottom: i !== 1 ? '1px solid var(--color-border)' : 'none',
                                        display: 'flex',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        background: notif.isNew ? 'var(--color-bg-secondary)' : 'transparent',
                                        transition: 'background var(--transition-fast)'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                                        onMouseLeave={e => e.currentTarget.style.background = notif.isNew ? 'var(--color-bg-secondary)' : 'transparent'}
                                    >
                                        {notif.isNew && <div style={{ width: 6, height: 6, background: 'var(--color-primary)', flexShrink: 0, marginTop: '6px' }}></div>}
                                        <div style={{ flex: 1, paddingLeft: notif.isNew ? 0 : '14px' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>{notif.title}</div>
                                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.775rem' }}>{notif.body}</div>
                                            <div style={{ color: 'var(--color-primary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{notif.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                    onClick={() => navigate('/profile')}
                >
                    <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>RK</div>
                    <div style={{ display: 'none' }}> {/* Hidden for ultra-minimal look in header, or keep if preferred */}
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>Dr. Ravi K.</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Layout = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <div className="app-container">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'var(--color-bg)',
                        color: 'var(--color-text-main)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                    },
                    success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
                    error: { iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' } },
                }}
            />
            <Sidebar />
            <main className="app-main">
                <Header />
                <div className={`page-content${isDashboard ? ' page-content--flush' : ''}`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
