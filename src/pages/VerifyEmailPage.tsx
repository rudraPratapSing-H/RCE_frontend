import React from 'react';
import { VerificationForm } from '../features/auth/VerificationForm';

export const VerifyEmailPage: React.FC = () => {
    return (
        <div className="flex bg-zinc-950 items-center justify-center min-h-screen text-zinc-100 p-4">
            <div className="w-full max-w-md">
                <VerificationForm />
            </div>
        </div>
    );
};
