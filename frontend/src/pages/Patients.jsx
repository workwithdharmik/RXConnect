import { useState, useEffect } from 'react';
import { Search, UserPlus, FileText, Calendar as CalendarIcon, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mobileNo.includes(searchQuery)
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Patient Management</h1>
                    <p className="page-subtitle">View and manage all registered clinic patients.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/patients/new')}
                >
                    <UserPlus size={18} />
                    Register New Patient
                </button>
            </div>

            <div className="clean-card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="header-search" style={{ width: '100%', maxWidth: '400px' }}>
                        <Search size={18} color="var(--color-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or phone..."
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
                                    <th style={{ padding: '1rem' }}>Patient ID & Name</th>
                                    <th style={{ padding: '1rem' }}>Contact</th>
                                    <th style={{ padding: '1rem' }}>Age/Gender</th>
                                    <th style={{ padding: '1rem' }}>Last Visit</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s ease', cursor: 'pointer' }}
                                        className="table-row-hover"
                                        onClick={() => navigate(`/patients/${patient.patientId}`)}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600 }}>{patient.fullName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{patient.patientId}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                <Phone size={14} color="var(--color-text-muted)" /> {patient.mobileNo}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            {patient.age} yrs • {patient.gender}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            {patient.lastVisit}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}
                                                    title="New Prescription"
                                                    onClick={(e) => { e.stopPropagation(); navigate('/prescriptions/new'); }}
                                                >
                                                    <FileText size={14} color="var(--color-primary)" />
                                                    <span style={{ marginLeft: '0.25rem' }}>Rx</span>
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}
                                                    title="Schedule Appointment"
                                                    onClick={(e) => { e.stopPropagation(); navigate('/appointments'); }}
                                                >
                                                    <CalendarIcon size={14} color="var(--color-primary)" />
                                                    <span style={{ marginLeft: '0.25rem' }}>Book</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No patients found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
