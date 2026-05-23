import React from "react";
import { SubmissionData } from "../hooks/allSubmission";


interface SubmissionCardProps {
  submission: SubmissionData;
  onSelect: (code: string, language: string) => void;
  isSelected: boolean;
  statusColor?: string;
}


const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onSelect, isSelected, statusColor }) => {
  const isAccepted = submission.status.toLowerCase() === 'accepted';
  const displayStatus = isAccepted ? 'Accepted' : 'Rejected';
  const handleSelect = () => {
    onSelect(submission.code, submission.language);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Load submission from ${new Date(submission.createdAt).toLocaleString()}`}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelect();
        }
      }}
      className={`mb-4 cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-4 transition hover:border-blue-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${isSelected ? "border-blue-500 bg-zinc-800" : ""}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <span className="font-semibold text-zinc-200">Status:</span> <span className={`font-mono ${statusColor ? statusColor : 'text-blue-400'}`}>{displayStatus}</span>
        </div>
        <div className="mt-2 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 sm:mt-0">
          Click to load in editor
        </div>
      </div>
      <div className="mt-1 text-xs text-zinc-400">{new Date(submission.createdAt).toLocaleString()}</div>
      <div className="mt-2 text-xs text-zinc-500">{displayStatus}</div>
    </div>
  );
};

export default SubmissionCard;
