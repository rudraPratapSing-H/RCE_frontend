// Backend Response Format Requirements for Frontend Test Hooks

/**
 * ENDPOINT: POST /api/submissions/run-public
 * 
 * Request Body:
 * {
 *   problemId: string;
 *   language: string;
 *   code: string;
 * }
 * 
 * Response Format:
 */
export interface PublicTestResponse {
  submissionId: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  totalTimeMs: number;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  cases: TestCaseResult[];
}

/**
 * ENDPOINT: POST /api/submissions/submit
 * 
 * Request Body:
 * {
 *   problemId: string;
 *   language: string;
 *   code: string;
 * }
 * 
 * Response Format (Initial):
 */
export interface SubmitInitialResponse {
  success: boolean;
  message: string;
  submissionId: string;
  status: 'Pending';
}

/**
 * ENDPOINT: GET /api/submissions/{submissionId}/status
 * 
 * Response Format:
 */
export interface SubmissionStatusResponse {
  submissionId: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  totalTimeMs: number;
  status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  cases: TestCaseResult[]; // Empty array while 'Pending' - revealed only after completion
}

/**
 * Individual Test Case Result
 */
export interface TestCaseResult {
  caseId: string;           // e.g., "1", "2", "3"
  input: string | object;   // Can be stringified JSON for objects
  expected: string;         // Expected output
  actual: string;           // Actual output from execution
  passed: boolean;          // whether test passed
  executionTimeMs: number;  // Milliseconds taken
  errorMessage?: string;    // If runtime error occurred
}

/**
 * IMPORTANT FRONTEND BEHAVIOR:
 * 
 * 1. Public Tests (Run Code Button):
 *    - Single HTTP POST call
 *    - Immediate full response with all test case details
 *    - No polling needed
 * 
 * 2. Private Tests (Submit Button):
 *    - Initial POST returns { submissionId, status: 'Pending' }
 *    - Frontend polls GET /api/submissions/{submissionId}/status every 1 second
 *    - When status !== 'Pending', polling stops and results displayed
 *    - Cases array should be empty while status is 'Pending'
 *    - Cases array returns only after execution complete (maintaining privacy)
 * 
 * 3. Error Handling:
 *    - If execution error: include errorMessage in test case
 *    - If submission error: return { success: false, message: "error details" }
 *    - Frontend displays red alert box with error message
 * 
 * 4. Output Display:
 *    - Input/expected/actual should be appropriate for language:
 *      - String outputs: direct string
 *      - JSON outputs: JSON.stringify(result, null, 2)
 *      - Numbers/primitives: String(result)
 *    - Newlines preserved in output display
 */
