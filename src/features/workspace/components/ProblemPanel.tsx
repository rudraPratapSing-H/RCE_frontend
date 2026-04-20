import React from 'react';
import type { Problem } from '../../../hooks/useProblem';

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

  const publicExamples = problem?.publicTestCases || [];

  return (
    <aside className="w-1/2 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-6">
      <h1 className="mb-4 text-2xl font-bold text-zinc-100">
        {problem?.title || 'Problem'}
      </h1>
      <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
        {problem?.description || 'No problem selected.'}
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-zinc-100">Public Examples</h2>

        {publicExamples.length === 0 ? (
          <p className="text-sm text-zinc-500">No public testcases available.</p>
        ) : (
          <div className="space-y-4">
            {publicExamples.map((testCase, index) => (
              <div key={index} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Example {index + 1}
                </p>

                <div className="mb-3">
                  <p className="mb-1 text-xs text-zinc-500">Input</p>
                  <pre className="whitespace-pre-wrap rounded-md bg-zinc-950 p-3 font-mono text-xs text-zinc-200">
                    {renderValue(testCase.input)}
                  </pre>
                </div>

                <div>
                  <p className="mb-1 text-xs text-zinc-500">Expected Output</p>
                  <pre className="whitespace-pre-wrap rounded-md bg-zinc-950 p-3 font-mono text-xs text-green-400">
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
