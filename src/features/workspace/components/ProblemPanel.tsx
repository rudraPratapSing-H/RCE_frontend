import React, { useMemo } from 'react';
import type { Problem } from '../../../hooks/useProblem';
import { sanitizeProblemHtml } from '../../../lib/htmlSanitizer';

type ProblemPanelProps = {
  problem: Problem | null;
};

export const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem }) => {
  const renderValue = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value === null || value === undefined) return '-';

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const resolveInputValue = (testCase: Record<string, unknown>) => {
    if (testCase.input !== undefined && testCase.input !== null && testCase.input !== '') {
      return testCase.input;
    }

    const entries = Object.entries(testCase);
    const firstNonExpected = entries.find(([key]) => key !== 'expectedOutput');
    return firstNonExpected ? firstNonExpected[1] : '-';
  };

  const formatDifficulty = (difficulty?: string) => {
    if (!difficulty) return 'Unknown';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  };

  const publicExamples = problem?.publicTestCases || [];
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

      <section className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-zinc-100">Public Examples</h2>

        {publicExamples.length === 0 ? (
          <p className="text-sm text-zinc-500">No public testcases available.</p>
        ) : (
          <div className="space-y-4">
            {publicExamples.map((testCase, index) => (
              <div key={index} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 md:p-4 overflow-hidden">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Example {index + 1}
                </p>

                <div className="mb-3">
                  <p className="mb-1 text-xs text-zinc-500">Input</p>
                  <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 font-mono text-xs text-zinc-200 whitespace-pre-wrap break-all md:break-words">
                    {renderValue(resolveInputValue(testCase))}
                  </pre>
                </div>

                <div>
                  <p className="mb-1 text-xs text-zinc-500">Expected Output</p>
                  <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 font-mono text-xs text-green-400 whitespace-pre-wrap break-all md:break-words">
                    {renderValue(testCase.expectedOutput)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
};
