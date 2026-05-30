import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { copyTextToClipboard } from '../../../lib/clipboard';
import type { TestCaseResult, ExecutionResult } from '../../../types/testExecution';

type ConsolePanelProps = {
  result: ExecutionResult | null;
  isRunning: boolean;
  error: string | null;
  onAddFailedCase?: (testCase: TestCaseResult) => void;
  selectedCaseIds?: string[];
};

const cleanDockerOutput = (output: string): string => {
  if (!output) return '';

  return output
    .split('\n')
    .filter((line) => {
      const lower = line.toLowerCase();
      return !(
        lower.includes('docker') ||
        lower.includes('container') ||
        lower.includes('oci runtime') ||
        lower.includes('runc') ||
        lower.match(/^(error|exec|cmd)/i)
      );
    })
    .join('\n')
    .trim();
};

export function ConsolePanel({
  result,
  isRunning,
  error,
  onAddFailedCase,
  selectedCaseIds = []
}: ConsolePanelProps) {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const safeCases = result?.cases || [];

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '(empty)';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const handleCopy = async (event: React.MouseEvent, key: string, value: string) => {
    event.stopPropagation();

    const copied = await copyTextToClipboard(value);

    if (copied) {
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1500);
    } else {
      setCopiedKey(null);
    }
  };

  const copyButtonLabel = (key: string) => (copiedKey === key ? 'Copied' : 'Copy');
  const isSelectedCase = (caseId: string) => selectedCaseIds.includes(caseId);

  if (isRunning) {
    return (
      <div className="h-full w-full min-h-0 border-zinc-800 bg-black p-4">
        <p className="animate-pulse text-sm text-zinc-300">Executing...</p>
      </div>
    );
  }

  if (error) {
    const cleanError = cleanDockerOutput(error);
    return (
      <div className="h-full w-full min-h-0 overflow-y-auto border-zinc-800 bg-black p-4">
        <div className="flex items-start gap-3 rounded bg-red-900/30 p-3 text-red-400">
          <AlertCircle className="mt-0.5 flex-shrink-0" size={18} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Execution Error</p>
            <pre className="mt-2 w-full whitespace-pre-wrap break-words font-mono text-xs text-red-300">
              {cleanError}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full w-full min-h-0 border-zinc-800 bg-black p-4">
        <p className="text-sm text-zinc-500">No output yet. Click "Run" or "Submit" to execute code.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-0 overflow-y-auto border-zinc-800 bg-black p-4">
      <div className="mb-4 rounded-lg bg-zinc-900 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm font-semibold text-zinc-300">
                {result.passedCases}/{result.totalCases} Tests Passed
              </span>
            </div>
            <div className="text-xs text-zinc-500">{result.totalTimeMs}ms</div>
          </div>
          <div>
            <span
              className={`font-semibold ${
                result.status === 'Accepted'
                  ? 'text-green-400'
                  : result.status === 'Pending' || result.status === 'Running'
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {result.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {safeCases.length === 0 && (
          <div className="rounded border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-400">
            No per-test-case details available for this run.
          </div>
        )}

        {safeCases.map((testCase) => (
          <div
            key={testCase.caseId}
            className="cursor-pointer rounded border border-zinc-800 bg-zinc-950 transition hover:bg-zinc-900"
            onClick={() => setExpandedCase(expandedCase === testCase.caseId ? null : testCase.caseId)}
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                {testCase.passed ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <XCircle size={18} className="text-red-500" />
                )}
                <span className="text-sm font-medium text-zinc-300">Test Case {testCase.caseId}</span>
              </div>
              <div className="flex items-center gap-2">
                {!testCase.passed && onAddFailedCase && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAddFailedCase(testCase);
                    }}
                    className={`rounded border px-2 py-0.5 text-[11px] transition ${
                      isSelectedCase(testCase.caseId)
                        ? 'border-green-500/40 bg-green-500/10 text-green-300'
                        : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {isSelectedCase(testCase.caseId) ? 'Added' : 'Add to rerun'}
                  </button>
                )}
                <span className="text-xs text-zinc-500">{testCase.executionTimeMs}ms</span>
              </div>
            </div>

            {expandedCase === testCase.caseId && (
              <div className="space-y-3 border-t border-zinc-800 bg-black p-3 text-xs">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold text-zinc-400">Input:</p>
                    <button
                      type="button"
                      onClick={(event) =>
                        handleCopy(event, `${testCase.caseId}-input`, formatValue(testCase.input))
                      }
                      className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
                    >
                      {copyButtonLabel(`${testCase.caseId}-input`)}
                    </button>
                  </div>
                  <pre className="rounded bg-zinc-900 p-2 whitespace-pre-wrap overflow-x-auto text-zinc-300">
                    {formatValue(testCase.input)}
                  </pre>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold text-zinc-400">Expected Output:</p>
                    <button
                      type="button"
                      onClick={(event) =>
                        handleCopy(event, `${testCase.caseId}-expected`, formatValue(testCase.expected))
                      }
                      className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
                    >
                      {copyButtonLabel(`${testCase.caseId}-expected`)}
                    </button>
                  </div>
                  <pre className="rounded bg-zinc-900 p-2 whitespace-pre-wrap overflow-x-auto text-green-400">
                    {formatValue(testCase.expected)}
                  </pre>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold text-zinc-400">Actual Output:</p>
                    <button
                      type="button"
                      onClick={(event) =>
                        handleCopy(event, `${testCase.caseId}-actual`, formatValue(testCase.actual || '(empty)'))
                      }
                      className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
                    >
                      {copyButtonLabel(`${testCase.caseId}-actual`)}
                    </button>
                  </div>
                  <pre
                    className={`rounded bg-zinc-900 p-2 whitespace-pre-wrap overflow-x-auto font-mono ${
                      testCase.passed ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatValue(testCase.actual || '(empty)')}
                  </pre>
                </div>

                {testCase.errorMessage && (
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-semibold text-red-400">Runtime Output:</p>
                      <button
                        type="button"
                        onClick={(event) =>
                          handleCopy(event, `${testCase.caseId}-runtime`, cleanDockerOutput(testCase.errorMessage))
                        }
                        className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
                      >
                        {copyButtonLabel(`${testCase.caseId}-runtime`)}
                      </button>
                    </div>
                    <pre className="max-h-none overflow-x-auto rounded bg-red-900/20 p-2 font-mono text-xs whitespace-pre-wrap break-words text-red-300">
                      {cleanDockerOutput(testCase.errorMessage)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
