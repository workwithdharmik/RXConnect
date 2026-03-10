import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ClipboardList, User, LogOut, ChevronRight, Activity, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPortal() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labOrders, setLabOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/portal/${patientId}`);
                const data = await res.json();
                if (res.ok && data) {
                    setPatient(data);
                    setPrescriptions(data.prescriptions || []);
                    setLabOrders(data.labOrders || []);
                } else {
                    toast.error(data.error || "Portal access denied or invalid ID");
                }
            } catch (err) {
                console.error(err);
                toast.error("Connectivity issue. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatientData();
    }, [patientId]);

    if (isLoading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)' }}>
            <div className="loading-spinner"></div>
        </div>
    );

    if (!patient) return (
        <div style={{ padding: '2rem', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--color-bg-secondary)' }}>
            <Activity size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>Access Restricted</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Please use the link sent to your registered mobile number.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ marginTop: '2rem', alignSelf: 'center' }}>Staff Login</button>
        </div>
    );

    return (
        <div style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: '1rem', paddingBottom: '6rem' }}>
            {/* Mobile Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem',
                background: 'white',
                border: '1px solid var(--color-border)',
                padding: '1rem', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                        <User size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>{patient.fullName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{patient.patientId}</div>
                    </div>
                </div>
                <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.5rem' }}>
                    <LogOut size={20} />
                </button>
            </div>

            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '1rem', letterSpacing: '0.1em', padding: '0 0.5rem' }}>My Health Records</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Prescriptions Card */}
                <div className="clean-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ color: 'var(--color-primary)' }}><ClipboardList size={22} /></div>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Prescriptions</span>
                        <span style={{ marginLeft: 'auto', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>{prescriptions.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {prescriptions.length === 0
                            ? <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>No prescriptions yet</p>
                            : prescriptions.map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{p.diagnosis || 'Consultation'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{p.date}</div>
                                    </div>
                                    <ChevronRight size={18} color="var(--color-text-muted)" />
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Lab Orders Card */}
                <div className="clean-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ color: '#9333ea' }}><FileText size={22} /></div>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Lab Reports</span>
                        <span style={{ marginLeft: 'auto', background: '#f3e8ff', color: '#9333ea', fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>{labOrders.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {labOrders.length === 0
                            ? <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>No lab reports yet</p>
                            : labOrders.map(o => (
                                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{o.testNames}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
                                            <span style={{
                                                fontSize: '0.65rem', padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-full)',
                                                background: o.status === 'COMPLETED' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                                                color: o.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-warning)',
                                                border: `1px solid transparent`,
                                                fontWeight: 800,
                                                letterSpacing: '0.02em'
                                            }}>
                                                {o.status}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} color="var(--color-text-muted)" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Bottom Floating Nav */}
            <div style={{
                position: 'fixed', bottom: '1.5rem', left: '1rem', right: '1rem',
                background: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: '30px', padding: '1rem',
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                color: 'var(--color-text-secondary)',
                boxShadow: 'var(--shadow-xl)'
            }}>
                <Activity size={24} color="var(--color-primary)" />
                <Calendar size={24} />
                <User size={24} />
            </div>
        </div>
    );
}
