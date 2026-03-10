import { useState } from 'react';
import { Shield, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InsuranceMockup() {
    const [isLinked, setIsLinked] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [abhaId, setAbhaId] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        if (!abhaId.match(/^\d{2}-\d{4}-\d{4}-\d{4}$/)) {
            toast.error("Please enter a valid ABHA ID (XX-XXXX-XXXX-XXXX)");
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setShowOtp(true);
            toast.success("OTP sent to linked mobile number");
        }, 1500);
    };

    const handleOtpSubmit = () => {
        if (otp.length !== 4) {
            toast.error("Enter 4-digit OTP");
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsLinked(true);
            toast.success("ABHA ID linked successfully!");
        }, 1500);
    };

    if (isLinked) {
        return (
            <div className="clean-card" style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success-dim)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-success)' }}>
                    <CheckCircle size={20} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>ABHA Verified</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>ID: {abhaId || '91-1234-5678-9012'}</div>
                    </div>
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(5, 150, 105, 0.1)', fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 600, opacity: 0.9 }}>
                    Linked to Ayushman Bharat Digital Mission (ABDM)
                </div>
            </div>
        );
    }

    return (
        <div className="clean-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                <Shield size={20} />
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Ayushman Bharat (ABHA)</h3>
            </div>

            {!showOtp ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Link patient's ABHA ID for paperless health records.</p>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="91-XXXX-XXXX-XXXX"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    />
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '0.85rem' }}
                        onClick={handleVerify}
                        disabled={isVerifying}
                    >
                        {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Link'}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Enter 4-digit OTP sent to mobile.</p>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="0000"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ textAlign: 'center', letterSpacing: '0.5rem', fontWeight: 700 }}
                    />
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '0.85rem' }}
                        onClick={handleOtpSubmit}
                        disabled={isVerifying}
                    >
                        {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Confirm OTP'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%', fontSize: '0.75rem', border: 'none' }}
                        onClick={() => setShowOtp(false)}
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );
}
