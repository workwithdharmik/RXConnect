import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, Calendar, Activity, ExternalLink, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import InsuranceMockup from '../components/Patients/InsuranceMockup';

export default function PatientProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labOrders, setLabOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('prescriptions');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Patient
            const ptRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`, { headers });
            const pts = await ptRes.json();
            const foundPt = pts.find(p => p.patientId === id || p.id === id);
            setPatient(foundPt);

            if (foundPt) {
                // Fetch Prescriptions (Mock or filtered from list)
                const prxRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions`, { headers });
                const prxs = await prxRes.json();
                setPrescriptions(prxs.filter(p => p.patientId === foundPt.patientId));

                // Fetch Lab Orders
                const labRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab/orders/patient/${foundPt.patientId}`, { headers });
                const labs = await labRes.json();
                setLabOrders(labs);
            }
        } catch (error) {
            toast.error("Failed to load patient history");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>;
    if (!patient) return <div className="clean-card">Patient not found</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/patients')} className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: 'var(--radius-full)' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>{patient.fullName}</h1>
                    <p className="page-subtitle" style={{ margin: 0 }}>ID: {patient.patientId} • {patient.gender} • {patient.mobileNo}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.5fr)', gap: '2rem' }}>
                {/* Left: Info Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="clean-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                            <User size={20} />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Patient Details</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                            <div>
                                <label style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Age</label>
                                {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A'} yrs
                            </div>
                            <div>
                                <label style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Blood Group</label>
                                {patient.bloodGroup || 'Not set'}
                            </div>
                            <div>
                                <label style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Allergies</label>
                                <span style={{ color: patient.allergies ? 'var(--color-danger)' : 'inherit' }}>{patient.allergies || 'None'}</span>
                            </div>
                        </div>
                    </div>

                    <InsuranceMockup />
                </div>

                {/* Right: History Tabs */}
                <div className="clean-card" style={{ padding: '0' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
                        <button
                            onClick={() => setActiveTab('prescriptions')}
                            style={{
                                padding: '1rem 2rem',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontWeight: 600,
                                color: activeTab === 'prescriptions' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                borderBottom: activeTab === 'prescriptions' ? '2px solid var(--color-primary)' : 'none'
                            }}
                        >
                            Prescriptions ({prescriptions.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('labs')}
                            style={{
                                padding: '1rem 2rem',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontWeight: 600,
                                color: activeTab === 'labs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                borderBottom: activeTab === 'labs' ? '2px solid var(--color-primary)' : 'none'
                            }}
                        >
                            Lab Investigations ({labOrders.length})
                        </button>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        {activeTab === 'prescriptions' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {prescriptions.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No prescriptions found</p> :
                                    prescriptions.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{p.diagnosis || 'General Consultation'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{p.date}</div>
                                            </div>
                                            <button className="btn btn-secondary" style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)' }}>
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {activeTab === 'labs' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {labOrders.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No lab orders found</p> :
                                    labOrders.map(o => (
                                        <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{o.testNames}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                    <Clock size={12} /> Ordered: {new Date(o.orderedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: o.status === 'COMPLETED' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                                                    color: o.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-warning)',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.02em'
                                                }}>
                                                    {o.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
