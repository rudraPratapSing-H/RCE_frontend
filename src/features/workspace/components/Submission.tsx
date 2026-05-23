import React from "react";
import { useAllSubmissions } from "../hooks/allSubmission";
import SubmissionCard from "./SubmissionCard";

interface SubmissionProps {
  problemId: string;
  language?: string;
  setCode?: (code: string) => void;
  setLanguage?: (language: string) => void;
}

const Submission: React.FC<SubmissionProps> = ({ problemId, language = "cpp", setCode, setLanguage }) => {
  const { submissions, loading, error } = useAllSubmissions(problemId, language);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center text-zinc-400 bg-zinc-950">Loading submissions...</div>
    );
  if (error)
    return (
      <div className="flex h-full items-center justify-center text-red-400 bg-zinc-950">Error: {error}</div>
    );
  if (!submissions.length)
    return (
      <div className="flex h-full items-center justify-center text-zinc-400 bg-zinc-950">No submissions found.</div>
    );

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 p-2 sm:p-4 md:p-6">
      <h1 className="mb-4 text-lg sm:text-xl md:text-2xl font-bold text-zinc-100 break-words">
        Past Submissions
      </h1>
      <div className="space-y-2">
        {submissions.map((submission, idx) => (
          <div className="w-full" key={submission.id}>
            <SubmissionCard
              submission={submission}
              isSelected={selectedIdx === idx}
              onSelect={(code, submissionLanguage) => {
                setSelectedIdx(idx);
                if (setLanguage && submissionLanguage) {
                  setLanguage(submissionLanguage);
                }
                if (setCode) {
                  setCode('');
                  window.setTimeout(() => setCode(code), 0);
                }
              }}
              statusColor={submission.status.toLowerCase() === 'accepted' ? 'text-green-400' : 'text-red-400'}
            />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Submission;
