// Test case result structure
export interface TestCaseResult {
  caseId: string;
  input: string | object;
  expected: string;
  actual: string;
  passed: boolean;
  executionTimeMs: number;
  errorMessage?: string;
}

// Overall execution result
export interface ExecutionResult {
  submissionId: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  totalTimeMs: number;
  status: string;
  cases: TestCaseResult[];
  visibility: 'public' | 'private'; // Track which type of cases ran
  isTerminal: boolean;
}
