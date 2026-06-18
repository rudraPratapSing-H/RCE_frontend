import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CompetitionTimerProps {
  startTime: string;
  endTime: string;
  onTimerEnd?: () => void;
}

export const CompetitionTimer: React.FC<CompetitionTimerProps> = ({ startTime, endTime, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const end = new Date(endTime.replace('Z', '')).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft(0);
        if (!hasEnded) {
          setHasEnded(true);
          onTimerEnd?.();
        }
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, hasEnded, onTimerEnd]);

  if (timeLeft === null) return null;

  if (hasEnded) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-400">
        <Clock className="h-4 w-4" />
        <span>Ended</span>
      </div>
    );
  }

  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = timeLeft < 1000 * 60 * 5; // Less than 5 minutes

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold tabular-nums tracking-wider ${
        isLowTime
          ? 'border-red-500/30 bg-red-500/20 text-red-400 animate-pulse'
          : 'border-blue-500/20 bg-blue-500/10 text-blue-400'
      }`}
    >
      <Clock className="h-4 w-4" />
      <span>{formattedTime}</span>
    </div>
  );
};
