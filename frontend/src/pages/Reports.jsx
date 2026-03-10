import { useState, useEffect } from 'react';
import { Plus, Printer, FileText, CheckCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        patientName: '',
        patientMobile: '',
        paymentMethod: 'UPI'
    });

    // Dynamic Items list
    const [items, setItems] = useState([
        { description: 'Consultation Fee', amount: 500 }
    ]);
    const [currentItem, setCurrentItem] = useState({ description: '', amount: '' });

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setInvoices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = () => {
        if (!currentItem.description || !currentItem.amount) return;
        setItems([...items, { description: currentItem.description, amount: Number(currentItem.amount) }]);
        setCurrentItem({ description: '', amount: '' });
    };

    const removeItem = (idx) => {
        const newArr = [...items];
        newArr.splice(idx, 1);
        setItems(newArr);
    };

    const calculateSubtotal = () => items.reduce((sum, item) => sum + item.amount, 0);

    const handleGenerateInvoice = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (items.length === 0) return setErrorMsg('Please add at least one line item to the invoice.');
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    items
                })
            });

            if (!res.ok) throw new Error('Failed to generate');

            setShowModal(false);
            fetchInvoices();
            toast.success('Invoice generated successfully!');
            // Reset
            setFormData({ patientName: '', patientMobile: '', paymentMethod: 'UPI' });
            setItems([{ description: 'Consultation Fee', amount: 500 }]);

        } catch (err) {
            setErrorMsg(err.message || 'An error occurred while generating the invoice.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in relative">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Revenue & Billing</h1>
                    <p className="page-subtitle">Generate GST invoices and track cash flow.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    New Invoice
                </button>
            </div>

            <div className="clean-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '1rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invoice No.</th>
                            <th style={{ padding: '1rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</th>
                            <th style={{ padding: '1rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method</th>
                            <th style={{ padding: '1rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total (Inc. GST)</th>
                            <th style={{ padding: '1rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}><div className="loading-spinner"></div></td></tr>
                        ) : invoices.map((inv) => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{inv.invoiceNumber}</td>
                                <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{inv.date}</td>
                                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{inv.patientName}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        background: inv.paymentMethod === 'UPI' ? 'var(--color-success-light)' :
                                            inv.paymentMethod === 'CASH' ? 'var(--color-warning-light)' : 'var(--color-primary-light)',
                                        color: inv.paymentMethod === 'UPI' ? 'var(--color-success)' :
                                            inv.paymentMethod === 'CASH' ? 'var(--color-warning)' : 'var(--color-primary)',
                                        border: `1px solid transparent`,
                                        padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700,
                                        letterSpacing: '0.02em'
                                    }}>
                                        {inv.paymentMethod}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 700 }}>₹{inv.total.toLocaleString()}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Print PDF" onClick={() => window.print()}>
                                        <Printer size={16} />
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem', color: '#16a34a' }} title="Send WhatsApp Receipt" onClick={() => toast('WhatsApp integration coming in Phase 2', { icon: '💬' })}>
                                        <Smartphone size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Booking Modal (Premium Redesign) */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-panel animate-fade-in" style={{
                        maxWidth: '900px',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        padding: 0,
                        overflow: 'hidden',
                    }}>

                        {/* Form Side */}
                        <div style={{ padding: '2.5rem', borderRight: '1px solid var(--color-border)', overflowY: 'auto', maxHeight: '90vh' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                <div style={{ padding: '0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-dim)' }}>
                                    <FileText size={24} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)', letterSpacing: '-0.03em' }}>Generate Invoice</h2>
                            </div>

                            {errorMsg && (
                                <div style={{ background: 'rgba(255,69,58,0.12)', color: '#FF453A', border: '1px solid rgba(255,69,58,0.25)', padding: '0.875rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} /> {errorMsg}
                                </div>
                            )}

                            <form id="billing-form" onSubmit={handleGenerateInvoice}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 600 }}>Patient Name</label>
                                    <input type="text" className="form-control" required value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="e.g. Rahul Sharma" style={{ padding: '0.875rem 1rem' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 600 }}>Mobile Number <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                                    <input type="tel" className="form-control" value={formData.patientMobile} onChange={e => setFormData({ ...formData, patientMobile: e.target.value })} placeholder="10-digit number for SMS" style={{ padding: '0.875rem 1rem' }} />
                                </div>

                                {/* Add Items List */}
                                <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>Line Items</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        <input type="text" className="form-control" placeholder="Service / Item" value={currentItem.description} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} />
                                        <input type="number" className="form-control" placeholder="₹ Amount" value={currentItem.amount} onChange={e => setCurrentItem({ ...currentItem, amount: e.target.value })} />
                                        <button type="button" className="btn btn-primary" onClick={addItem}><Plus size={20} /></button>
                                    </div>

                                    {/* Item Display */}
                                    <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                                        {items.length === 0 ? (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No items added yet.</div>
                                        ) : items.map((it, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: i !== items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{it.description}</span>
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>₹{it.amount}</span>
                                                    <button type="button" onClick={() => removeItem(i)} style={{ color: 'var(--color-danger)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: '0.25rem 0.5rem', textTransform: 'uppercase' }}>Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 600 }}>Payment Mode</label>
                                    <select className="form-control" value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} style={{ padding: '0.875rem 1rem', cursor: 'pointer', appearance: 'none' }}>
                                        <option value="UPI">UPI / QR Scan</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Credit / Debit Card</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        {/* Receipt Preview Side */}
                        <div style={{ padding: '2rem', background: 'var(--color-bg-tertiary)', display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '90vh' }}>
                            <div style={{ flex: '1 0 auto', background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ textAlign: 'center', borderBottom: '1.5px dashed var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>RxConnect Clinic</h3>
                                    <p style={{ margin: '0.375rem 0 0 0', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>GSTIN: 27AABCU9603R1ZX</p>
                                </div>

                                <div style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
                                    <div style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-main)' }}>Billed To:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{formData.patientName || '______________'}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                                        <span>Date: {new Date().toLocaleDateString()}</span>
                                        <span>Mode: <strong style={{ color: 'var(--color-text-main)' }}>{formData.paymentMethod}</strong></span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem', fontSize: '0.9rem', minHeight: '120px' }}>
                                    {items.map((it, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                                            <span>{it.description}</span>
                                            <span>₹{it.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                        <span>Subtotal</span>
                                        <span style={{ fontWeight: 500 }}>₹{calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                        <span>CGST (9%)</span>
                                        <span>₹{Math.round(calculateSubtotal() * 0.09).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                        <span>SGST (9%)</span>
                                        <span>₹{Math.round(calculateSubtotal() * 0.09).toFixed(2)}</span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', marginTop: '1.5rem', background: 'var(--color-success-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                                        <span>TOTAL DUE</span>
                                        <span>₹{Math.round(calculateSubtotal() * 1.18).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    Thank you for choosing Dr. Ravi's Clinic!
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexShrink: 0 }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.875rem', borderRadius: '12px', fontWeight: 600 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" form="billing-form" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '0.875rem', borderRadius: '12px', fontWeight: 600 }} disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : <><CheckCircle size={18} /> Issue Receipt</>}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
