import React from 'react';
import { Clock, Play, Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

type WorkspaceToolbarProps = {
  language: string;
  setLanguage: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
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
  isRunning
}) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
      <div className="flex items-center gap-3">
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {LANGUAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <Button variant="secondary" className="w-auto px-3">
          <Clock className="h-4 w-4" />
          <span>Start Timer</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={onRun} isLoading={isRunning} className="w-auto px-3">
          {!isRunning && <Play className="h-4 w-4" />}
          <span>Run Code</span>
        </Button>
        <Button variant="secondary" onClick={onSubmit} isLoading={isRunning} className="w-auto px-3">
          {!isRunning && <Send className="h-4 w-4" />}
          <span>Submit</span>
        </Button>
      </div>
    </div>
  );
};
