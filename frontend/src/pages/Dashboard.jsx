import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, CheckCircle, ArrowRight, Activity, Plus, FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({
        todayAppointments: 0,
        completedAppointments: 0,
        pendingReports: 0,
        activePatients: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [actionItems, setActionItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch today's appointments
                const resApt = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/today`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const aptData = await resApt.json();

                // Sort appointments by timeSlot
                const sortedApts = Array.isArray(aptData) ? aptData.sort((a, b) => {
                    return (a.timeSlot || '').localeCompare(b.timeSlot || '');
                }) : [];

                // Calculate completed vs pending
                // Determine current status based on logic: appointments before current time are 'completed'
                const now = new Date();
                const currentTime = now.getHours() * 100 + now.getMinutes();

                let completedCount = 0;
                let nextAppointment = null;

                sortedApts.forEach(apt => {
                    const timeValue = apt.timeStr || "";
                    const [timePart, modifier] = timeValue.split(' ');
                    if (timePart && modifier) {
                        let [hours, minutes] = timePart.split(':');
                        hours = parseInt(hours, 10);
                        if (modifier === 'PM' && hours < 12) hours += 12;
                        if (modifier === 'AM' && hours === 12) hours = 0;
                        const aptTimeValue = hours * 100 + parseInt(minutes, 10);

                        if (aptTimeValue < currentTime) {
                            completedCount++;
                            apt.passed = true;
                        } else if (!nextAppointment) {
                            nextAppointment = apt;
                            apt.isNext = true;
                        }
                    }
                });

                // Fetch general stats
                const resStats = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await resStats.json();

                // Fetch Lab Stats
                const resLabStats = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const labStats = await resLabStats.json();

                // Fetch Pending Action Items (Lab Orders)
                const resPending = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab/pending`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const pendingData = await resPending.json();

                setAppointments(sortedApts);
                setActionItems(Array.isArray(pendingData) ? pendingData : []);
                setStats({
                    todayAppointments: sortedApts.length || 0,
                    completedAppointments: completedCount,
                    pendingReports: labStats.pendingCount || 0,
                    activePatients: statsData.totalPatients || 0
                });

            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const now = new Date();
    const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

    // Determine Action-Oriented Status Message
    let statusMessage = "";
    let actionButton = null;

    const remainingApts = stats.todayAppointments - stats.completedAppointments;
    const nextApt = appointments.find(a => a.isNext);

    if (stats.todayAppointments === 0) {
        statusMessage = "You have no appointments scheduled for today.";
        actionButton = <button className="btn btn-secondary" onClick={() => navigate('/appointments/new')}>Review Walk-ins</button>;
    } else if (remainingApts === 0) {
        if (stats.pendingReports > 0) {
            statusMessage = `You've finished all appointments. Please review ${stats.pendingReports} pending lab reports.`;
            actionButton = <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/lab')}>Review Labs <ArrowRight size={16} /></button>;
        } else {
            statusMessage = "Excellent work! All appointments and reports are cleared for today.";
            actionButton = <button className="btn btn-secondary" onClick={() => navigate('/appointments')}>View Tomorrow's Schedule</button>;
        }
    } else if (nextApt) {
        statusMessage = `It is time for your next appointment with ${nextApt.patientName} at ${nextApt.timeStr}.`;
        actionButton = <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/prescriptions/new', { state: { patientId: nextApt.patient?.patientId || nextApt.patientId, doctorId: nextApt.doctorId, patientName: nextApt.patientName } })}>Start Consultation <ArrowRight size={16} /></button>;
    }


    return (
        <div className="animate-fade-in" style={{ position: 'relative', minHeight: '100%', background: 'var(--color-bg-secondary)' }}>
            <div style={{ padding: '2.5rem 2rem' }}>

                {isLoading ? (
                    <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* ZONE 1: Immediate Action Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 className="page-title" style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>Welcome back, Dr. Ravi.</h1>
                                <p style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dateString}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn btn-secondary" onClick={() => navigate('/patients/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                                    <Plus size={14} /> Walk-in
                                </button>
                                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/prescriptions/new')}>
                                    <FileSignature size={14} /> AI Scribe
                                </button>
                            </div>
                        </div>

                        {/* Status Message / Action Band */}
                        <div style={{ background: 'var(--color-bg)', padding: '1rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse 2s infinite' }}></div>
                                {statusMessage}
                            </div>
                            {actionButton}
                        </div>

                        {/* ZONE 2: Day Overview Cards (Pro-Utilitarian) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1px', background: 'var(--color-border)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', overflow: 'hidden' }}>
                            <div style={{ background: 'var(--color-bg)', padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                    Appointments
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }}></div>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    {stats.completedAppointments}
                                    <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Seen</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                    {stats.todayAppointments} Total Scheduled
                                </div>
                            </div>

                            <div style={{ background: 'var(--color-bg)', padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                    Reports
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stats.pendingReports > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}></div>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                    {stats.pendingReports}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                    Pending lab results
                                </div>
                            </div>

                            <div style={{ background: 'var(--color-bg)', padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                                    Clinic Activity (Last 24h)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px', paddingBottom: '4px' }}>
                                    {[...Array(24)].map((_, i) => {
                                        const h = 5 + Math.random() * 35;
                                        const isOk = Math.random() > 0.1;
                                        return (
                                            <div key={i} style={{
                                                flex: 1,
                                                height: `${h}px`,
                                                background: isOk ? 'var(--color-text-main)' : 'var(--color-warning)',
                                                opacity: 0.8,
                                                borderRadius: '1px'
                                            }}></div>
                                        )
                                    })}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                    <span>Morning</span>
                                    <span>Evening</span>
                                </div>
                            </div>
                        </div>

                        {/* ZONE 3: Clinical Workspace */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            {/* Left Col: Today's Schedule */}
                            <div className="clean-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)' }}>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Today's Schedule
                                    </h3>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                        {remainingApts} Remaining
                                    </span>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
                                    {appointments.length === 0 ? (
                                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No appointments scheduled for today.</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {appointments.map((apt, idx) => (
                                                <div key={idx} style={{
                                                    padding: '1.25rem 1.5rem',
                                                    borderBottom: '1px solid var(--color-border)',
                                                    background: apt.isNext ? 'var(--color-primary-light)' : (apt.passed ? 'var(--color-bg-secondary)' : 'var(--color-bg)'),
                                                    opacity: apt.passed ? 0.6 : 1,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main)', width: '80px' }}>{apt.timeStr}</div>
                                                        <div style={{ borderLeft: `3px solid ${apt.isNext ? 'var(--color-primary)' : 'var(--color-border)'}`, height: '40px' }}></div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                {apt.patientName}
                                                                {apt.passed && <CheckCircle size={14} color="var(--color-success)" />}
                                                            </div>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{apt.type} • {apt.doctorName}</div>
                                                        </div>
                                                    </div>
                                                    {(apt.isNext || !apt.passed) && (
                                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/prescriptions/new', { state: { patientId: apt.patient?.patientId || apt.patientId, doctorId: apt.doctorId, patientName: apt.patientName } })}>
                                                            Write Rx
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Col: Action Items */}
                            <div className="clean-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Action Items
                                    </h3>
                                </div>
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '400px' }}>
                                    {actionItems.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No urgent action items.</div>
                                    ) : (
                                        actionItems.map((item, idx) => (
                                            <div key={idx} style={{ padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-danger)' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pending Lab Order</div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.125rem' }}>{item.patient?.fullName || 'Unknown Patient'}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{item.testNames}</div>
                                                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('/lab')}>Review Now</button>
                                            </div>
                                        ))
                                    )}

                                    {/* Mock Refill remains as an example if no more labs */}
                                    {actionItems.length < 2 && (
                                        <div style={{ padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Rx Refill Request</div>
                                            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.125rem' }}>Priya Singh</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Requested refill for Metformin 500mg.</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem', flex: 1, justifyContent: 'center' }}>Deny</button>
                                                <button className="btn btn-primary" style={{ padding: '0.4rem', fontSize: '0.8rem', flex: 1, justifyContent: 'center' }} onClick={() => navigate('/prescriptions/new')}>Approve</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
}
