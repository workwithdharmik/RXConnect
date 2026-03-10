import { useState, useEffect } from 'react';
import { Search, Plus, Printer, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRx, setSelectedRx] = useState(null); // State for View/Print Modal
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = prescriptions.filter(p =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Digital Prescriptions</h1>
                    <p className="page-subtitle">Generate MCI-compliant prescriptions for your patients.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/prescriptions/new')}
                >
                    <Plus size={18} />
                    New Prescription
                </button>
            </div>

            <div className="clean-card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="header-search" style={{ width: '100%', maxWidth: '400px' }}>
                        <Search size={18} color="var(--color-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by patient or diagnosis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Patient Name</th>
                                    <th style={{ padding: '1rem' }}>Diagnosis</th>
                                    <th style={{ padding: '1rem' }}>Medicines</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((rx) => (
                                    <tr key={rx.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }}>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{rx.date}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{rx.patientName}</td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{rx.diagnosis}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span style={{
                                                    background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                                                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500
                                                }}>
                                                    {rx.medicines.length} Item(s)
                                                </span>
                                                {rx.audioUrl && (
                                                    <span style={{
                                                        background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                                                        padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'
                                                    }} title="AI Audio Recording attached">
                                                        <Search size={12} /> Audio
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '8px' }} title="View" onClick={() => setSelectedRx(rx)}>
                                                    <Eye size={16} color="var(--color-text-muted)" />
                                                </button>
                                                <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '8px' }} title="Print / PDF" onClick={() => {
                                                    setSelectedRx(rx);
                                                    setTimeout(() => window.print(), 100);
                                                }}>
                                                    <Printer size={16} color="var(--color-primary)" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No prescriptions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View/Print Modal */}
            {selectedRx && (
                <div className="modal-overlay print-overlay">
                    <div className="modal-panel animate-fade-in print-card" style={{
                        maxWidth: '650px',
                        background: 'white',
                        padding: '2.5rem',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Prescription Details</h2>
                            <button onClick={() => setSelectedRx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Printable Area */}
                        <div id="printable-rx" style={{ padding: '1rem' }}>
                            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--color-primary)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                                <h1 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>ClinicFlow Pro</h1>
                                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Dr. Ravi Sharma (MBBS, MD)</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                <div>
                                    <p style={{ margin: '0 0 0.5rem' }}><strong>Patient:</strong> {selectedRx.patientName}</p>
                                    <p style={{ margin: 0 }}><strong>Diagnosis:</strong> {selectedRx.diagnosis}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 0.5rem' }}><strong>Date:</strong> {selectedRx.date}</p>
                                    <p style={{ margin: 0 }}><strong>Rx ID:</strong> #{selectedRx.id}</p>
                                </div>
                            </div>

                            {selectedRx.audioUrl && (
                                <div className="no-print" style={{ marginBottom: '2rem', background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Consultation Recording</h4>
                                    <audio controls src={`${import.meta.env.VITE_API_BASE_URL}${selectedRx.audioUrl}`} style={{ width: '100%', height: '40px' }}></audio>
                                </div>
                            )}

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Rx</h3>
                                {selectedRx.medicines && selectedRx.medicines.map((med, idx) => (
                                    <div key={idx} style={{ marginBottom: '1rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{idx + 1}. {med.name.toUpperCase()}</div>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            <span><strong>DOSAGE:</strong> {med.dosage}</span>
                                            <span><strong>DURATION:</strong> {med.duration} DAYS</span>
                                            {med.instructions && <span><strong>NOTES:</strong> {med.instructions}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '150px', borderBottom: '1px solid #cbd5e1', marginBottom: '0.5rem' }}></div>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Doctor's Signature</span>
                                </div>
                            </div>
                        </div>

                        <div className="no-print" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px' }} onClick={() => setSelectedRx(null)}>Close</button>
                            <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px' }} onClick={() => window.print()}>
                                <Printer size={18} /> Print Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
