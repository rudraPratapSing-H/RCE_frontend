import React, { useEffect, useState } from 'react';
import { Clock, Timer, Play, Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

type WorkspaceToolbarProps = {
  language: string;
  setLanguage: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  competitionId?: string;
  onOpenDashboard?: () => void;
  timerSeconds?: number;
};

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' }
];

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  language,
  setLanguage,
  onRun,
  onSubmit,
  isRunning,
  competitionId,
  onOpenDashboard,
  timerSeconds
}) => {
  const navigate = () => {
    if (competitionId && onOpenDashboard) {
      onOpenDashboard();
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatClock = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2 relative">
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {LANGUAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {timerSeconds !== undefined && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 rounded-md border border-zinc-700 bg-zinc-950/50 px-3 py-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-mono text-xs font-medium text-blue-300">{formatTime(timerSeconds)}</span>
          </div>
          <div className="h-3 w-px bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono text-xs font-medium text-zinc-400">{formatClock(currentTime)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5">
        {competitionId && (
          <Button variant="secondary" onClick={navigate} className="w-auto rounded-md px-2 py-1 text-[11px] leading-none bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30">
            <span>Questions & Leaderboard</span>
          </Button>
        )}
        <Button variant="primary" onClick={onRun} isLoading={isRunning} className="w-auto rounded-md px-2 py-1 text-[11px] leading-none">
          {!isRunning && <Play className="h-3 w-3" />}
          <span>Run Code</span>
        </Button>
        <Button variant="secondary" onClick={onSubmit} isLoading={isRunning} className="w-auto rounded-md px-2 py-1 text-[11px] leading-none">
          {!isRunning && <Send className="h-3 w-3" />}
          <span>Submit</span>
        </Button>
      </div>
    </div>
  );
};
