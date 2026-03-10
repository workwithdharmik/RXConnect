import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewPatient() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'Male',
        mobileNo: '',
        address: '',
        bloodGroup: '',
        allergies: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            toast.success('Patient registered successfully!');
            navigate('/patients');
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem', borderRadius: 'var(--radius-full)' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>Register New Patient</h1>
                    <p className="page-subtitle" style={{ margin: 0 }}>Add a new patient to the clinic registry.</p>
                </div>
            </div>

            <div className="clean-card" style={{ maxWidth: '800px' }}>
                {errorMsg && (
                    <div style={{
                        background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-dim)', padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600
                    }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                        {/* Basic Info */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Basic Information</h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input type="text" className="form-control" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="e.g. Rahul Sharma" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mobile Number *</label>
                            <input type="tel" className="form-control" name="mobileNo" required pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" value={formData.mobileNo} onChange={handleChange} placeholder="10-digit number" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input type="number" className="form-control" name="age" min="1" max="120" value={formData.age} onChange={handleChange} placeholder="Years" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select className="form-control" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Full Address</label>
                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="House no, Street, City" />
                        </div>

                        {/* Medical Context */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Medical Context</h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Blood Group</label>
                            <select className="form-control" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Known Allergies (Optional)</label>
                            <input type="text" className="form-control" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Peanuts" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/patients')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <UserPlus size={18} /> Register Patient
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
