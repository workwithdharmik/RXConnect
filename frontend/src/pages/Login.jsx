import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Phone } from 'lucide-react';

export default function Login() {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            background: 'var(--color-bg-secondary)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative subtle light orb */}
            <div style={{
                position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '600px',
                background: 'radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', opacity: 0.5
            }} />

            <div className="animate-fade-in" style={{
                width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10,
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px', height: '64px', margin: '0 auto 1.5rem',
                        background: 'var(--color-primary)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
                    }}>
                        <Activity size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>
                        RxConnect
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', fontWeight: 500, margin: 0 }}>
                        Clinic Management Platform
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2.5rem',
                    boxShadow: 'var(--shadow-xl)',
                }}>
                    {errorMsg && (
                        <div style={{
                            background: 'var(--color-danger-light)',
                            color: 'var(--color-danger)',
                            border: '1px solid var(--color-danger-dim)',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            fontWeight: 600
                        }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="+91 98765 43210"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    style={{ paddingLeft: '2.75rem' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingLeft: '2.75rem' }}
                                    required
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <a href="#" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500 }}>Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 600, borderRadius: '12px' }}
                            disabled={isLoading}
                        >
                            {isLoading ? <div className="loading-spinner" style={{ width: '22px', height: '22px', borderWidth: '2.5px', borderTopColor: '#000' }} /> : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
                    Secure access for authorized clinic staff only.
                </p>
            </div>
        </div>
    );
}
