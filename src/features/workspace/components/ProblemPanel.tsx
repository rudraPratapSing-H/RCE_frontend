import React, { useMemo } from 'react';
import type { Problem } from '../../../hooks/useProblem';
import { sanitizeProblemHtml } from '../../../lib/htmlSanitizer';

type ProblemPanelProps = {
  problem: Problem | null;
};

export const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem }) => {
  const formatDifficulty = (difficulty?: string) => {
    if (!difficulty) return 'Unknown';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  };

  const rawDescription = problem?.description || 'No problem selected.';
  const sanitizedDescription = useMemo(() => sanitizeProblemHtml(rawDescription), [rawDescription]);

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 p-4 md:p-6">
      <h1 className="mb-4 text-xl md:text-2xl font-bold text-zinc-100 break-words">
        {problem?.title || 'Problem'}
      </h1>

      <div className="mb-4 inline-flex items-center self-start rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
        Difficulty: {formatDifficulty(problem?.difficulty)}
      </div>

      <div
        className="text-sm leading-7 text-zinc-300 prose prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </aside>
  );
};
