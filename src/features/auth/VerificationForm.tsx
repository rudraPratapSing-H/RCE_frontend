import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { OtpInput } from '../../components/ui/OtpInput';
import { Button } from '../../components/ui/Button';
import { Timer } from '../../components/ui/Timer';
import { useVerifyEmail } from './hooks/useVerifyEmail';
import { useResendOTP } from './hooks/useResendOTP';
import { useLocation, useNavigate } from 'react-router-dom';

export const VerificationForm: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [resendSuccess, setResendSuccess] = useState<string | null>(null);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const { verifyEmail, isLoading: isVerifyLoading, error: verifyError, setError: setVerifyError } = useVerifyEmail();
    const { resendOTP, isLoading: isResendLoading, error: resendError, setError: setResendError } = useResendOTP();
    
    const isLoading = isVerifyLoading || isResendLoading;
    const error = verifyError || resendError;
    const setError = (err: string | null) => {
      setVerifyError(err);
      setResendError(err);
    };
    
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve email from state passed via navigate('/verify-email', { state: { email } })
    const email = location.state?.email || '';

    // If no email is provided, user manually navigated to this route -> redirect back
    React.useEffect(() => {
        if (!email) {
            navigate('/');
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP code");
            return;
        }

        await verifyEmail(email, otp);
    };

    const handleResend = async () => {
        if (isTimerActive) return; // Prevent resend if timer is still running

        setResendSuccess(null);
        setError(null);
        await resendOTP(email);
        if (!error) {
            setResendSuccess("A fresh code has been sent to your email.");
            // Clear standard OTP boxes automatically
            setOtp('');
            setIsTimerActive(true); // Restart the timer
        }
    };

    return (
        <Card className="p-8 w-full max-w-md mx-auto bg-zinc-900 border-zinc-800 border">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
                <p className="text-zinc-400 text-sm">
                    We've sent a 6-digit confirmation code to <strong className="text-white">{email}</strong>. 
                    Please enter it below.
                </p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded border border-red-500/20 text-center">
                    {error}
                </div>
            )}
            {resendSuccess && !error && (
                <div className="mb-4 text-sm text-green-500 bg-green-500/10 p-3 rounded border border-green-500/20 text-center">
                    {resendSuccess}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3 text-center">
                        One-Time Password
                    </label>
                    <OtpInput
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        error={error ? "Invalid code" : undefined}
                        disabled={isLoading}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading || otp.length !== 6} 
                    className="w-full mt-8"
                    variant="primary"
                >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
                
                <div className="mt-4 flex flex-col gap-2 text-center">
                    <div className="flex items-center justify-center">
                        <button 
                            type="button" 
                            onClick={handleResend}
                            disabled={isLoading || isTimerActive}
                            className={`text-sm transition-colors ${
                                isTimerActive || isLoading 
                                    ? 'text-zinc-500 cursor-not-allowed' 
                                    : 'text-zinc-400 hover:text-zinc-300'
                            }`}
                        >
                            Didn't receive a code? <span className={`${!isTimerActive ? 'text-white hover:underline' : ''}`}>Resend OTP</span>
                        </button>
                        {isTimerActive && (
                            <Timer 
                                initialSeconds={15} 
                                isCounting={isTimerActive} 
                                onTimerComplete={() => setIsTimerActive(false)} 
                            />
                        )}
                    </div>
                    <button 
                        type="button" 
                        onClick={() => navigate('/')} 
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2"
                    >
                        Use a different account
                    </button>
                </div>
            </form>
        </Card>
    );
};
