import React, { useEffect, useState } from 'react';
import { Clock, Play, Send } from 'lucide-react';
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

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
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

        {timerSeconds !== undefined && (
          <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="min-w-[3.5rem] font-mono text-xs text-zinc-300">{formatTime(timerSeconds)}</span>
          </div>
        )}
      </div>

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
