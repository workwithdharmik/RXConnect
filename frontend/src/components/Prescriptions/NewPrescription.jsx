import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Zap, FileText, Mic, Square, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSuggestions } from '../../utils/ai-engine';

export default function NewPrescription() {
    const navigate = useNavigate();
    const location = useLocation();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        doctorId: '',
        diagnosis: '',
        medicines: [],
        audioUrl: ''
    });
    const [drugSearch, setDrugSearch] = useState('');
    const [drugResults, setDrugResults] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]);
    const [labSearch, setLabSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI Scribe States
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Current medicine being added
    const [currentMed, setCurrentMed] = useState({
        drugName: '', dosage: '', frequency: '1-0-1', durationDays: 3, instructions: ''
    });

    useEffect(() => {
        const fetchPts = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setPatients(data);
        };

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

        const fetchLabs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab/tests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) setLabTests(data);
            } catch (err) {
                console.error("Failed to fetch lab tests", err);
            }
        };

        fetchPts();
        fetchDoctors();
        fetchLabs();
    }, []);

    // Sync context from Dashboard/Appointments
    useEffect(() => {
        if (location.state) {
            const { patientId, doctorId, patientName } = location.state;
            setFormData(prev => ({
                ...prev,
                patientId: patientId || prev.patientId,
                doctorId: doctorId || prev.doctorId,
                patientName: patientName || prev.patientName
            }));
        }
    }, [location.state]);

    // Sync IDs and Names once lists load
    useEffect(() => {
        if (patients.length > 0) {
            // Case 1: We have a name but no ID (fallback match)
            if (formData.patientName && !formData.patientId) {
                const pt = patients.find(p => p.fullName.toLowerCase() === formData.patientName.toLowerCase());
                if (pt) setFormData(prev => ({ ...prev, patientId: pt.patientId }));
            }
            // Case 2: We have an ID but no name (sync UI)
            else if (formData.patientId && !formData.patientName) {
                const pt = patients.find(p => p.patientId === formData.patientId);
                if (pt) setFormData(prev => ({ ...prev, patientName: pt.fullName }));
            }
        }
    }, [patients, formData.patientId, formData.patientName]);

    // AI Scribe Functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                processAudio(blob);
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            toast.error('Microphone access denied or unavailable');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const processAudio = async (audioBlob) => {
        setIsProcessingAI(true);
        toast.loading('AI Assistant is processing audio...', { id: 'ai-processing' });
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'prescription_audio.webm');

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/scribe`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`AI processing failed: ${res.status} ${errText}`);
            }

            const data = await res.json();
            setTranscript(data.transcript);

            if (data.structuredData) {
                const newMeds = (data.structuredData.medicines || []).map(med => ({
                    drugName: med.name || med.drugName || '',
                    dosage: med.dosage || '',
                    frequency: med.frequency || '',
                    durationDays: med.duration ? parseInt(med.duration) : 3,
                    instructions: med.instructions || ''
                })).filter(med => med.drugName && med.dosage); // Filter out empty blank entries

                if (newMeds.length === 0) {
                    toast.error("AI couldn't recognize any medicines. Please try recording again or add manually.", { id: 'ai-processing', duration: 4000 });
                } else {
                    toast.success(`AI extracted ${newMeds.length} medicine(s) and appended them!`, { id: 'ai-processing' });
                }

                setFormData(prev => ({
                    ...prev,
                    diagnosis: data.structuredData.diagnosis || prev.diagnosis, // Keep existing diagnosis if new one is blank
                    medicines: [...prev.medicines, ...newMeds], // ALWAYS append new meds
                    audioUrl: data.audioUrl || prev.audioUrl // Keep latest audio chunk
                }));
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to process audio with AI Scribe', { id: 'ai-processing' });
        } finally {
            setIsProcessingAI(false);
        }
    };

    // Debounced Drug Search
    useEffect(() => {
        const fetchDrugs = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/drugs/search?q=${drugSearch}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setDrugResults(data);
        };

        const timeout = setTimeout(fetchDrugs, 300);
        return () => clearTimeout(timeout);
    }, [drugSearch]);

    // AI Suggestions based on Diagnosis
    useEffect(() => {
        const suggs = getSuggestions(formData.diagnosis);
        setSuggestions(suggs);
    }, [formData.diagnosis]);

    const addMedicine = (medData) => {
        const isEvent = medData && typeof medData.preventDefault === 'function';
        const medToAdd = (!isEvent && medData && medData.drugName) ? medData : currentMed;

        if (!medToAdd.drugName || !medToAdd.dosage) {
            toast.error("Please provide both drug name and dosage.");
            return;
        }

        setFormData(prev => ({
            ...prev,
            medicines: [...prev.medicines, { ...medToAdd }]
        }));

        if (isEvent || !medData || !medData.drugName) {
            // Reset "Add New" form
            setCurrentMed({ drugName: '', dosage: '', frequency: '1-0-1', durationDays: 3, instructions: '' });
            setDrugSearch('');
        } else {
            toast.success(`Added ${medToAdd.drugName}`);
        }
    };

    const removeMedicine = (index) => {
        const newMeds = [...formData.medicines];
        newMeds.splice(index, 1);
        setFormData({ ...formData, medicines: newMeds });
    };

    const handlePatientChange = (e) => {
        const id = e.target.value;
        const pt = patients.find(p => p.patientId === id);
        setFormData({ ...formData, patientId: id, patientName: pt ? pt.fullName : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.medicines.length === 0) {
            toast.error("Please add at least one medicine to the prescription.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            // Create Prescription
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Prescription generation failed');

            // Create Lab Order if tests selected
            if (selectedLabs.length > 0) {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        patientId: formData.patientId,
                        doctorId: formData.doctorId,
                        testNames: selectedLabs.map(l => l.name).join(', '),
                        instructions: 'Requested via digital prescription'
                    })
                });
            }

            toast.success('Prescription generated successfully!');
            navigate('/prescriptions');
        } catch (err) {
            toast.error(err.message || 'An error occurred while generating the prescription.');
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
                    <h1 className="page-title" style={{ margin: 0 }}>New Prescription</h1>
                    <p className="page-subtitle" style={{ margin: 0 }}>Digital Rx Generation.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                {/* Left Col: Prescription Builder */}
                <div className="clean-card">
                    {/* AI Scribe Banner */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: isRecording ? 'var(--color-danger-light)' : 'var(--color-primary-light)', border: `1px solid ${isRecording ? 'var(--color-danger-dim)' : 'var(--color-primary-dim)'}`, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: isRecording ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                                {isRecording ? <span style={{ width: '12px', height: '12px', background: 'var(--color-danger)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span> : <Mic size={24} />}
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>AI Auto-Scribe</h3>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Supports any language. Speak more to <strong style={{ color: 'var(--color-primary)' }}>append</strong> new medicines.</p>
                                </div>
                            </div>
                            <div>
                                {!isRecording && !isProcessingAI && (
                                    <button type="button" onClick={startRecording} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mic size={16} /> Start Recording
                                    </button>
                                )}
                                {isRecording && (
                                    <button type="button" onClick={stopRecording} className="btn" style={{ background: 'var(--color-danger)', color: 'white', border: '1px solid currentColor', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Square size={16} /> Stop & Process
                                    </button>
                                )}
                                {isProcessingAI && (
                                    <button type="button" disabled className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...
                                    </button>
                                )}
                            </div>
                        </div>
                        {transcript && (
                            <div style={{ background: 'var(--color-bg)', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                " {transcript} "
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Select Patient</label>
                                <select className="form-control" required value={formData.patientId} onChange={handlePatientChange}>
                                    <option value="">-- Choose Patient --</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.patientId}>{p.fullName} ({p.patientId})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Consulting Doctor</label>
                                <select className="form-control" required value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}>
                                    <option value="">-- Select Practitioner --</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Diagnosis / Symptoms (Optional)</label>
                                <input type="text" className="form-control" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="e.g. Viral Fever, Body Ache" />

                                {suggestions.length > 0 && (
                                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
                                            <Zap size={14} /> SMART SUGGESTIONS:
                                        </div>
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => addMedicine(s)}
                                                style={{
                                                    background: 'var(--color-bg)',
                                                    color: 'var(--color-primary)',
                                                    border: '1px solid var(--color-primary-dim)',
                                                    padding: '0.5rem 0.875rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: 'var(--shadow-sm)'
                                                }}
                                                className="suggestion-btn"
                                            >
                                                + {s.drugName}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Investigations Section */}
                        <div style={{ padding: '0 0.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'flex-end', background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Search Lab Test</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter test name (e.g. CBC, Lipid Profile)"
                                        value={labSearch}
                                        onChange={(e) => setLabSearch(e.target.value)}
                                        list="lab-list"
                                    />
                                    <datalist id="lab-list">
                                        {labTests.map(t => <option key={t.id} value={t.name} />)}
                                    </datalist>
                                </div>
                                <button type="button" className="btn btn-secondary" style={{ height: '42px' }} onClick={() => {
                                    const test = labTests.find(t => t.name === labSearch);
                                    if (test && !selectedLabs.some(l => l.id === test.id)) {
                                        setSelectedLabs([...selectedLabs, test]);
                                        setLabSearch('');
                                    }
                                }}>
                                    <Plus size={16} /> Add
                                </button>
                            </div>

                            {selectedLabs.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                                    {selectedLabs.map((lab, i) => (
                                        <div key={i} style={{
                                            background: 'var(--color-primary-light)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-full)',
                                            border: '1px solid var(--color-primary-dim)',
                                            color: 'var(--color-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span style={{ fontWeight: 600 }}>{lab.name}</span>
                                            <Trash2 size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setSelectedLabs(selectedLabs.filter((_, idx) => idx !== i))} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Rx - Medicines</h3>

                            {/* Medicine List */}
                            {formData.medicines.length > 0 && (
                                <div style={{ marginBottom: '1.5rem', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-dim)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                                    {formData.medicines.map((m, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: idx !== formData.medicines.length - 1 ? '1px solid rgba(37, 99, 235, 0.1)' : 'none' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: 'var(--color-primary-hover)' }}>{m.drugName} - {m.dosage}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                    {m.frequency} • {m.durationDays} Days • {m.instructions}
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeMedicine(idx)} style={{ color: 'var(--color-danger)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Medicine Form Block */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ gridColumn: '1 / -1', marginBottom: '1rem', position: 'relative' }}>
                                    <label className="form-label">Drug Search (Database)</label>
                                    <input type="text" className="form-control" placeholder="Search medicines..." value={currentMed.drugName} onChange={(e) => { setDrugSearch(e.target.value); setCurrentMed({ ...currentMed, drugName: e.target.value }) }} />

                                    {drugSearch && drugResults.length > 0 && currentMed.drugName !== drugResults[0] && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: 'var(--shadow-lg)', marginTop: '0.25rem' }}>
                                            {drugResults.map((drug, i) => (
                                                <div key={i} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--color-bg-tertiary)', color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.9rem' }} onClick={() => { setCurrentMed({ ...currentMed, drugName: drug }); setDrugSearch(''); }} className="dropdown-item">
                                                    {drug}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Dosage</label>
                                        <input type="text" className="form-control" placeholder="1 Tab" value={currentMed.dosage} onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Frequency</label>
                                        <select className="form-control" value={currentMed.frequency} onChange={(e) => setCurrentMed({ ...currentMed, frequency: e.target.value })}>
                                            <option value="1-0-0">Morning</option>
                                            <option value="1-0-1">Morning, Night</option>
                                            <option value="1-1-1">Thrice a day</option>
                                            <option value="0-0-1">Night only</option>
                                            <option value="SOS">SOS (As needed)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration (Days)</label>
                                        <input type="number" className="form-control" placeholder="3" value={currentMed.durationDays} onChange={(e) => setCurrentMed({ ...currentMed, durationDays: e.target.value })} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                        <label className="form-label">Instructions</label>
                                        <input type="text" className="form-control" placeholder="After meals" value={currentMed.instructions} onChange={(e) => setCurrentMed({ ...currentMed, instructions: e.target.value })} />
                                    </div>
                                    <button type="button" className="btn btn-secondary" onClick={addMedicine}>
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/prescriptions')}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Prescription</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Col: PDF Preview Mockup */}
                <div>
                    <div className="clean-card" style={{ height: '800px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            MCI Compliant Preview
                        </div>
                        <div style={{ flex: 1, background: '#f8f9fa', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto' }}>
                            <div style={{
                                width: '100%',
                                background: 'white',
                                border: '1px solid #dee2e6',
                                display: 'flex',
                                flexDirection: 'column',
                                fontFamily: "'Inter', sans-serif",
                                color: '#333'
                            }}>
                                {/* Header Banner */}
                                <div style={{
                                    background: '#f4a261',
                                    padding: '0.75rem',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #dee2e6'
                                }}>
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                        color: '#1d3557',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>Medical Prescription</h2>
                                </div>

                                {/* Patient Info Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ padding: '0.75rem', background: '#fff3e0', borderRight: '1px solid #dee2e6' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', marginBottom: '0.25rem' }}>Name of the Patient:</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{formData.patientName || '________________'}</div>
                                    </div>
                                    <div style={{ padding: '0.75rem' }}>
                                        {/* Blank cell as per design */}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ padding: '0.75rem', borderRight: '1px solid #dee2e6' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Date of Birth</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, textAlign: 'center', marginTop: '0.25rem' }}>
                                            {patients.find(p => p.patientId === formData.patientId)?.dob
                                                ? new Date(patients.find(p => p.patientId === formData.patientId).dob).toLocaleDateString()
                                                : '________________'}
                                        </div>
                                    </div>
                                    <div style={{ padding: '0.75rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Age:</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, textAlign: 'center', marginTop: '0.25rem' }}>
                                            {patients.find(p => p.patientId === formData.patientId)?.age || '____'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '0.75rem', background: '#fff3e0', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', borderBottom: '1px solid #dee2e6', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>Contact Details: [mention complete contact details of a patient]</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {patients.find(p => p.patientId === formData.patientId)?.mobileNo || '________________'}
                                    </div>
                                </div>

                                <div style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', borderBottom: '1px solid #dee2e6', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>Date: [mention the date on when the prescription is being written]</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{new Date().toLocaleDateString()}</div>
                                </div>

                                <div style={{ padding: '0.75rem', background: '#fff3e0', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', borderBottom: '1px solid #dee2e6', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>Diagnosed with: [Name of the illness that the patient is suffering from]</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{formData.diagnosis || '________________'}</div>
                                </div>

                                {/* Vitals Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ padding: '0.75rem', borderRight: '1px solid #dee2e6' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Blood Pressure:</div>
                                        <div style={{ fontSize: '1rem', textAlign: 'center', marginTop: '0.25rem' }}>____ / ____ mmHg</div>
                                    </div>
                                    <div style={{ padding: '0.75rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Pulse rate</div>
                                        <div style={{ fontSize: '1rem', textAlign: 'center', marginTop: '0.25rem' }}>____ bpm</div>
                                    </div>
                                </div>

                                {/* Medicine Table */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 120px) minmax(0, 120px)', background: '#fff3e0', borderBottom: '1px solid #dee2e6', fontWeight: 900, fontSize: '0.8rem', textAlign: 'center', color: '#111' }}>
                                    <div style={{ padding: '0.5rem', borderRight: '1px solid #dee2e6' }}>Drug</div>
                                    <div style={{ padding: '0.5rem', borderRight: '1px solid #dee2e6' }}>Unit (tablet, or syrup)</div>
                                    <div style={{ padding: '0.5rem' }}>Dosage (per day)</div>
                                </div>

                                {formData.medicines.length > 0 ? formData.medicines.map((m, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 120px) minmax(0, 120px)', borderBottom: '1px solid #dee2e6', fontSize: '0.85rem' }}>
                                        <div style={{ padding: '0.5rem 0.75rem', borderRight: '1px solid #dee2e6', fontWeight: 800, color: '#000' }}>{m.drugName}</div>
                                        <div style={{ padding: '0.5rem', borderRight: '1px solid #dee2e6', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Tablet</div>
                                        <div style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.dosage} ({m.frequency})</div>
                                    </div>
                                )) : (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 120px) minmax(0, 120px)', borderBottom: '1px solid #dee2e6', height: '35px' }}>
                                            <div style={{ borderRight: '1px solid #dee2e6' }}></div><div style={{ borderRight: '1px solid #dee2e6' }}></div><div></div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 120px) minmax(0, 120px)', borderBottom: '1px solid #dee2e6', height: '35px', background: '#fff3e0' }}>
                                            <div style={{ borderRight: '1px solid #dee2e6' }}></div><div style={{ borderRight: '1px solid #dee2e6' }}></div><div></div>
                                        </div>
                                    </>
                                )}

                                {/* Footer Sections */}
                                <div style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', borderBottom: '1px solid #dee2e6', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>Examination to be done (if any): [Mention the name of the examination that a patient needs to do.]</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                        {selectedLabs.length > 0 ? selectedLabs.map(l => l.name).join(', ') : '________________'}
                                    </div>
                                </div>

                                <div style={{ padding: '0.75rem', background: '#fff3e0', borderBottom: '1px solid #dee2e6' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', borderBottom: '1px solid #dee2e6', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>Things to follow: [Mention if there are any health regimes a patients needs to follow regular]</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Follow regular prescription instructions.</div>
                                </div>

                                {/* Signature Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 'auto' }}>
                                    <div style={{ padding: '0.75rem', borderRight: '1px solid #dee2e6' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Signature of the physician:</div>
                                        <div style={{ marginTop: '1.5rem', borderBottom: '1px solid #ccc', display: 'inline-block', minWidth: '150px' }}>
                                            {formData.doctorId ? doctors.find(d => d.id === formData.doctorId)?.name : ''}
                                        </div>
                                    </div>
                                    <div style={{ padding: '0.75rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Date:</div>
                                        <div style={{ marginTop: '1.5rem', borderBottom: '1px solid #ccc', display: 'inline-block', minWidth: '120px' }}>
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
