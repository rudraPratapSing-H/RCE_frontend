import React, { useRef, KeyboardEvent, ClipboardEvent } from 'react';

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (inputsRef.current[index]) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Extract only digits
    if (!val) return;

    const newOtp = value.split('');
    // Take the last character in case they paste multiple or type quickly
    newOtp[index] = val.substring(val.length - 1);
    const joined = newOtp.join('').slice(0, length);
    onChange(joined);

    // Focus next input if there's a value and not the last box
    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = value.split('');
      
      if (newOtp[index]) {
        // Clear current box
        newOtp[index] = '';
        onChange(newOtp.join(''));
      } else if (index > 0) {
        // Clear previous box and step backwards
        newOtp[index - 1] = '';
        onChange(newOtp.join(''));
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    
    // Focus the box immediately after the pasted data
    if (pastedData.length > 0) {
      focusInput(Math.min(pastedData.length, length - 1));
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div 
        className="flex gap-2 sm:gap-3 justify-between w-full" 
        onPaste={handlePaste}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={2}
            disabled={disabled}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold bg-zinc-950 border ${
              error 
                ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                : 'border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/50'
            } rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>
      {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
    </div>
  );
};
