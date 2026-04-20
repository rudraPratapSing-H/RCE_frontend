import React, { useEffect, useState } from 'react';

export interface TimerProps {
  initialSeconds: number;
  onTimerComplete?: () => void;
  isCounting: boolean;
}

export const Timer: React.FC<TimerProps> = ({ 
  initialSeconds, 
  onTimerComplete,
  isCounting 
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isCounting || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimerComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting, secondsLeft, onTimerComplete]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (secondsLeft === 0) return null;

  return (
    <span className="inline-flex items-center justify-center bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded-md text-xs font-mono border border-zinc-700/50 shadow-inner ml-2">
      <svg 
        className="w-3 h-3 mr-1.5 text-zinc-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {formatTime(secondsLeft)}
    </span>
  );
};
