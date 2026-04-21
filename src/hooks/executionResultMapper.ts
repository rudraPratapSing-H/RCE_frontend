import { ExecutionResult, TestCaseResult } from '../types/testExecution';

type BackendCaseDetail = {
  testCase?: number;
  input?: unknown;
  testCaseData?: unknown;
  output?: string;
  expectedOutput?: string;
  passed?: boolean;
  error?: string;
};

type BackendStatusResponse = {
  success?: boolean;
  status?: string;
  details?: unknown;
  testCasesPassed?: number | null;
  totalTestCases?: number | null;
  message?: string;
};

const TERMINAL_STATUSES = ['Accepted'];

const isTerminalStatus = (status: string): boolean => {
  if (!status) return false;
  if (status === 'Pending' || status === 'Running') return false;
  if (TERMINAL_STATUSES.includes(status)) return true;
  return true;
};

const parseDetails = (details: unknown): BackendCaseDetail[] => {
  if (!Array.isArray(details)) return [];
  return details as BackendCaseDetail[];
};

const deriveInputFromObject = (value: unknown): unknown => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return '';
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return '';

  // Prefer the first non-expectedOutput field from the test-case object.
  const firstNonExpected = entries.find(([key]) => key !== 'expectedOutput');
  if (firstNonExpected) return firstNonExpected[1];

  return entries[0][1];
};

export const mapStatusToExecutionResult = (
  payload: BackendStatusResponse,
  submissionId: string,
  visibility: 'public' | 'private'
): ExecutionResult => {
  const status = String(payload?.status || 'Pending');
  const details = parseDetails(payload?.details);

  const cases: TestCaseResult[] = details.map((item, index) => {
    const fallbackInput = deriveInputFromObject(item?.testCaseData);

    return {
      caseId: String(item?.testCase ?? index + 1),
      input: item?.input ?? fallbackInput,
      expected: String(item?.expectedOutput ?? ''),
      actual: String(item?.output ?? ''),
      passed: Boolean(item?.passed),
      executionTimeMs: 0,
      errorMessage: item?.error
    };
  });

  const detailsTotalCases = cases.length;
  const detailsPassedCases = cases.filter((item) => item.passed).length;

  const totalCases = Number.isFinite(Number(payload?.totalTestCases))
    ? Number(payload?.totalTestCases)
    : detailsTotalCases;

  const passedCases = Number.isFinite(Number(payload?.testCasesPassed))
    ? Number(payload?.testCasesPassed)
    : detailsPassedCases;

  const failedCases = Math.max(totalCases - passedCases, 0);

  return {
    submissionId,
    totalCases,
    passedCases,
    failedCases,
    totalTimeMs: 0,
    status,
    cases,
    visibility,
    isTerminal: isTerminalStatus(status)
  };
};

export const isExecutionTerminal = (result: ExecutionResult): boolean => {
  return result.isTerminal;
};
