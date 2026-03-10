import { useState, useEffect } from 'react';
import { Save, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Settings() {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState('loading'); // loading, configured, not_configured
    const [maskedKey, setMaskedKey] = useState('');
    const [fallbackAvailable, setFallbackAvailable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            setStatus(data.groqApiKeyStatus);
            setMaskedKey(data.maskedApiKey || '');
            setFallbackAvailable(data.fallbackAvailable);
        } catch (error) {
            console.error('Failed to load settings', error);
            toast.error('Failed to load settings');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ groqApiKey: apiKey })
            });

            if (res.ok) {
                toast.success('Settings saved successfully!');
                setApiKey(''); // Clear input after save
                fetchSettings(); // Refresh status
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Save settings error', error);
            toast.error('An error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your clinic configurations and third-party integrations.</p>

            <div style={{ maxWidth: '800px', marginTop: '2rem' }}>
                <div className="clean-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <Key size={24} color="var(--color-primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>AI Integrations</h2>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Groq API Configuration</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Configure your Groq API key here to power the AI Scribe feature. This key is used for transcribing audio and structuring prescriptions automatically.
                        </p>

                        <div style={{
                            padding: '1rem',
                            background: status === 'configured' ? 'var(--color-success-light)' : 'var(--color-bg-secondary)',
                            border: `1px solid ${status === 'configured' ? 'var(--color-success-dim)' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            {status === 'configured' ? (
                                <><CheckCircle size={20} color="var(--color-success)" /><span style={{ fontWeight: 600, color: 'var(--color-success)' }}>API Key is Configured ({maskedKey})</span></>
                            ) : (
                                fallbackAvailable ? (
                                    <><AlertCircle size={20} color="var(--color-text-secondary)" /><span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Using global fallback key from environment.</span></>
                                ) : (
                                    <><AlertCircle size={20} color="var(--color-danger)" /><span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>API Key is Missing. AI Scribe will not work.</span></>
                                )
                            )}
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Update Groq API Key</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="gsk_..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    style={{ width: '100%', maxWidth: '500px' }}
                                />
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                    Leave blank and save to remove your personal key and use the global fallback (if available).
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
