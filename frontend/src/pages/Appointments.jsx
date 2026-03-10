import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, UserPlus, Phone, CheckCircle, Video, ChevronLeft, ChevronRight, FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Calendar View State
    const [viewMode, setViewMode] = useState('month'); // 'day', 'week', 'month', 'year', 'schedule'
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showModal, setShowModal] = useState(false);

    // Modal Form State
    const [formData, setFormData] = useState({
        patientName: '',
        patientMobile: '',
        gender: 'Male',
        age: '',
        date: new Date().toISOString().split('T')[0],
        timeStr: '10:00 AM',
        timeSlot: '10:00',
        type: 'NEW',
        doctorId: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referenceDate, viewMode]);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/doctors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setDoctors(data);
        } catch (err) {
            console.error("Failed to fetch doctors", err);
        }
    };

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAppointments(data); // In a real app, we'd fetch for the date range
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to book');

            setShowModal(false);
            fetchAppointments();
            setFormData({
                patientName: '',
                patientMobile: '',
                gender: 'Male',
                age: '',
                date: selectedDate,
                timeStr: '10:00 AM',
                timeSlot: '10:00',
                type: 'NEW',
                doctorId: doctors.length > 0 ? doctors[0].id : ''
            });
            toast.success('Appointment booked successfully!');
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openBookingFor = (date, timeStr = '10:00 AM', timeSlot = '10:00') => {
        setFormData({
            ...formData,
            date,
            timeStr,
            timeSlot,
            patientName: '',
            patientMobile: ''
        });
        setShowModal(true);
    };

    const handleComplete = (id) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: 'COMPLETED' } : apt
        ));
    };

    // Calendar Navigation
    const handlePrev = () => {
        const d = new Date(referenceDate);
        if (viewMode === 'day') d.setDate(d.getDate() - 1);
        else if (viewMode === 'week') d.setDate(d.getDate() - 7);
        else if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
        else if (viewMode === 'year') d.setFullYear(d.getFullYear() - 1);
        setReferenceDate(d);
    };

    const handleNext = () => {
        const d = new Date(referenceDate);
        if (viewMode === 'day') d.setDate(d.getDate() + 1);
        else if (viewMode === 'week') d.setDate(d.getDate() + 7);
        else if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
        else if (viewMode === 'year') d.setFullYear(d.getFullYear() + 1);
        setReferenceDate(d);
    };

    const handleToday = () => {
        setReferenceDate(new Date());
    };

    const getTitle = () => {
        if (viewMode === 'day') return referenceDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        if (viewMode === 'month') return referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (viewMode === 'year') return referenceDate.getFullYear().toString();
        if (viewMode === 'week') {
            const start = new Date(referenceDate);
            start.setDate(start.getDate() - start.getDay());
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return "Schedule";
    };

    // Calendar Data Helpers
    const monthDays = useMemo(() => {
        const year = referenceDate.getFullYear();
        const month = referenceDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Prev month padding
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), currentMonth: false });
        }
        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), currentMonth: true });
        }
        // Next month padding
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ date: new Date(year, month + 1, i), currentMonth: false });
        }
        return days;
    }, [referenceDate]);

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 9; i <= 18; i++) {
            slots.push(`${i < 10 ? '0' + i : i}:00`);
            slots.push(`${i < 10 ? '0' + i : i}:30`);
        }
        return slots;
    }, []);

    const renderMonthView = () => (
        <div className="cal-grid-month">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(h => (
                <div key={h} style={{ padding: '0.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-muted)', textAlign: 'center', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>{h}</div>
            ))}
            {monthDays.map((d, i) => {
                const dateStr = d.date.toISOString().split('T')[0];
                const dayApts = appointments.filter(a => a.date === dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;

                return (
                    <div key={i} className={`cal-cell ${d.currentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}`} onClick={(e) => {
                        // If clicking the cell itself (background) or the date number, open booking
                        if (e.target.classList.contains('cal-cell') || e.target.classList.contains('cal-date-num') || e.target.classList.contains('cal-cell-header')) {
                            openBookingFor(dateStr);
                        } else {
                            setSelectedDate(dateStr);
                            setFormData(prev => ({ ...prev, date: dateStr }));
                            if (viewMode === 'month') setViewMode('day');
                            setReferenceDate(d.date);
                        }
                    }}>
                        <div className="cal-cell-header">
                            <span className="cal-date-num">{d.date.getDate()}</span>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {dayApts.slice(0, 3).map(apt => (
                                <div key={apt.id} className={`cal-apt-pill ${apt.type === 'NEW' ? 'cal-apt-new' : 'cal-apt-followup'}`}>
                                    {apt.timeSlot} {apt.patientName}
                                </div>
                            ))}
                            {dayApts.length > 3 && (
                                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-text-muted)', paddingLeft: '4px' }}>
                                    + {dayApts.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderWeekView = () => (
        <div className="cal-grid-week scroll-none">
            <div className="cal-week-header">
                <div className="cal-time-cell" style={{ borderRight: '1px solid var(--color-border)' }}>GMT+5:30</div>
                {[0, 1, 2, 3, 4, 5, 6].map(i => {
                    const d = new Date(referenceDate);
                    d.setDate(d.getDate() - d.getDay() + i);
                    const isToday = new Date().toDateString() === d.toDateString();
                    return (
                        <div key={i} className={`cal-time-cell ${isToday ? 'today' : ''}`} style={{ borderRight: '1px solid var(--color-border)', flexDirection: 'column', height: '60px' }}>
                            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                            <div className="cal-date-num" style={{ fontSize: '1rem' }}>{d.getDate()}</div>
                        </div>
                    );
                })}
            </div>
            <div className="cal-week-body">
                <div className="cal-time-col">
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                        <div key={t} className="cal-time-cell">{t}</div>
                    ))}
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map(i => {
                    const d = new Date(referenceDate);
                    d.setDate(d.getDate() - d.getDay() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    const dayApts = appointments.filter(a => a.date === dateStr);

                    return (
                        <div key={i} className="cal-day-col">
                            {[9, 10, 11, 12, 13, 14, 15, 16, 17].map(h => {
                                const timeStr = `${h < 10 ? '0' + h : h}:00`;
                                const displayTime = `${h % 12 || 12}:00 ${h >= 12 ? 'PM' : 'AM'}`;
                                return (
                                    <div key={h} className="cal-slot" onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            openBookingFor(dateStr, displayTime, timeStr);
                                        }
                                    }}>
                                        {dayApts.filter(a => parseInt(a.timeSlot.split(':')[0]) === h).map(apt => (
                                            <div key={apt.id} className={`cal-apt-pill ${apt.type === 'NEW' ? 'cal-apt-new' : 'cal-apt-followup'}`} style={{ margin: '2px' }}>
                                                {apt.timeSlot} {apt.patientName}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderYearView = () => {
        const year = referenceDate.getFullYear();
        const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        return (
            <div className="cal-grid-year">
                {months.map(m => {
                    const d = new Date(year, m, 1);
                    const name = d.toLocaleDateString('en-US', { month: 'long' });
                    const daysInMonth = new Date(year, m + 1, 0).getDate();
                    const firstDay = new Date(year, m, 1).getDay();

                    return (
                        <div key={m} className="mini-month" onClick={() => {
                            setReferenceDate(new Date(year, m, 1));
                            setViewMode('month');
                        }}>
                            <div className="mini-month-title">{name}</div>
                            <div className="mini-month-grid">
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`p-${i}`} className="mini-day" />)}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayDate = new Date(year, m, i + 1);
                                    const dateStr = dayDate.toISOString().split('T')[0];
                                    const hasApt = appointments.some(a => a.date === dateStr);
                                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                                    return (
                                        <div key={i} className={`mini-day ${hasApt ? 'has-apt' : ''} ${isToday ? 'today' : ''}`}>
                                            {i + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderListView = () => (
        <div style={{ padding: '1.5rem', background: 'var(--color-bg)' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Appointments for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            {appointments.filter(a => a.date === selectedDate).length === 0 ? (
                <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <CalendarIcon size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                    <p>No appointments booked for this date.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {appointments.filter(a => a.date === selectedDate).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)).map(apt => (
                        <div key={apt.id} style={{
                            display: 'flex', alignItems: 'center', padding: '1rem',
                            background: apt.status === 'COMPLETED' ? 'var(--color-bg-secondary)' : 'var(--color-bg)',
                            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                            borderLeft: `4px solid ${apt.type === 'NEW' ? 'var(--color-primary)' : '#7C3AED'}`,
                        }}>
                            <div style={{ width: '80px', fontWeight: 700, fontSize: '0.85rem' }}>{apt.timeStr}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{apt.patientName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{apt.doctor?.name || 'Practitioner'} • {apt.type}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {apt.status === 'SCHEDULED' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '50%' }} title="Complete" onClick={() => handleComplete(apt.id)}>
                                            <CheckCircle size={14} />
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem', borderRadius: '50%' }}
                                            title="Write Prescription"
                                            onClick={() => navigate('/prescriptions/new', { state: { patientId: apt.patient?.patientId || apt.patientId, doctorId: apt.doctorId, patientName: apt.patientName } })}
                                        >
                                            <FileSignature size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="animate-fade-in relative">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="page-title">Appointments</h1>
                    <p className="page-subtitle">Multi-view calendar for clinic scheduling.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setFormData({ ...formData, date: selectedDate });
                        setShowModal(true);
                    }}
                >
                    <UserPlus size={18} />
                    New Booking
                </button>
            </div>

            <div className="cal-container">
                <div className="cal-header-bar">
                    <div className="cal-nav-group">
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }} onClick={handleToday}>Today</button>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={handlePrev}><ChevronLeft size={18} /></button>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={handleNext}><ChevronRight size={18} /></button>
                        <h2 className="cal-title">{getTitle()}</h2>
                    </div>

                    <div className="cal-view-selector">
                        {['day', 'week', 'month', 'year', 'schedule'].map(v => (
                            <button
                                key={v}
                                className={`cal-view-btn ${viewMode === v ? 'active' : ''}`}
                                onClick={() => setViewMode(v)}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflow: 'auto' }}>
                    {isLoading ? (
                        <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'month' && renderMonthView()}
                            {viewMode === 'week' && renderWeekView()}
                            {viewMode === 'year' && renderYearView()}
                            {(viewMode === 'day' || viewMode === 'schedule') && renderListView()}
                        </>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-panel animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Book Slot</h2>
                            <CalendarIcon size={20} color="var(--color-primary)" />
                        </div>

                        <form onSubmit={handleBooking}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Patient Name</label>
                                    <input type="text" className="form-control" required value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="e.g. John Doe" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Patient Mobile</label>
                                    <input type="tel" className="form-control" required value={formData.patientMobile} onChange={e => setFormData({ ...formData, patientMobile: e.target.value })} placeholder="9999999999" />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Age</label>
                                    <input type="number" className="form-control" required value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="e.g. 25" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Practitioner</label>
                                <select className="form-control" required value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })}>
                                    <option value="">-- Choose --</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Time</label>
                                    <select className="form-control" value={formData.timeSlot} onChange={e => {
                                        const val = e.target.value;
                                        setFormData({ ...formData, timeSlot: val, timeStr: val });
                                    }}>
                                        {timeSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 2 }}>
                                    {isSubmitting ? 'Booking...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
