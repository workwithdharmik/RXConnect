import { useState, useEffect } from 'react';
import { User, Mail, Phone, Award, Shield, BookOpen, Building, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        qualification: '',
        specialization: '',
        registrationNo: '',
        bio: '',
        clinicName: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setFormData({
                    name: data.name || '',
                    qualification: data.qualification || '',
                    specialization: data.specialization || '',
                    registrationNo: data.registrationNo || '',
                    bio: data.bio || '',
                    clinicName: data.clinicName || ''
                });
            }
        } catch (err) {
            console.error('Fetch profile error', err);
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (err) {
            console.error('Update profile error', err);
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <div className="loading-spinner"></div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Doctor Profile</h1>
                    <p className="page-subtitle">Manage your clinical identity and account settings</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="clean-card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Header Banner */}
                <div style={{
                    height: '120px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: '-40px',
                        left: '2rem',
                        width: '100px',
                        height: '100px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-bg)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'var(--color-primary)',
                        border: '3px solid var(--color-bg)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        {user.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                    </div>
                </div>

                <div style={{ padding: '3rem 2rem 2rem 2rem' }}>
                    {isEditing ? (
                        <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Qualification</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. MBBS, MD"
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Specialization</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Cardiologist"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Medical Registration No.</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="MCI or State Council No."
                                    value={formData.registrationNo}
                                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Clinic Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.clinicName}
                                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Professional Bio</label>
                                <textarea
                                    className="form-control"
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h2>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
                                    {user.qualification} {user.specialization ? `| ${user.specialization}` : ''}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <InfoRow icon={Phone} label="Mobile" value={user.mobile} />
                                    <InfoRow icon={Shield} label="Registration No." value={user.registrationNo || 'Not Set'} />
                                    <InfoRow icon={Building} label="Clinic" value={user.clinicName || 'Personal Practice'} />
                                </div>
                            </div>

                            <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-dim)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <BookOpen size={18} /> Professional Summary
                                </h3>
                                <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-main)', fontStyle: user.bio ? 'normal' : 'italic' }}>
                                    {user.bio || 'Add a bio to let your patients know more about your expertise and clinical background.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-primary)', background: 'var(--color-bg-tertiary)', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <Icon size={18} />
            </div>
            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{value}</div>
            </div>
        </div>
    );
}
