import { useRef, useState } from 'react';
import { ExecutionResult } from '../types/testExecution';
import apiClient from '../lib/apiClient';
import { isExecutionTerminal, mapStatusToExecutionResult } from './executionResultMapper';

interface UsePublicTestCasesReturn {
  result: ExecutionResult | null;
  isRunning: boolean;
  error: string | null;
  runPublicTests: (problemId: string, language: string, code: string) => Promise<void>;
}

export const usePublicTestCases = (): UsePublicTestCasesReturn => {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activePollTokenRef = useRef(0);

  const stopExistingPoll = () => {
    activePollTokenRef.current += 1;
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runPublicTests = async (problemId: string, language: string, code: string) => {
    try {
      stopExistingPoll();
      const pollToken = activePollTokenRef.current;
      setIsRunning(true);
      setError(null);
      setResult(null);

      const response = await apiClient.post('/api/execute-public', {
        problemId,
        language,
        code
      });

      const submissionId = response?.data?.submissionId;
      if (!submissionId) {
        throw new Error('Submission ID missing in execute-public response.');
      }

      // Poll until terminal status so public run behavior matches backend async queue processing.
      while (activePollTokenRef.current === pollToken) {
        const statusResponse = await apiClient.get(`/api/status/${submissionId}`);
        const executionResult = mapStatusToExecutionResult(statusResponse.data, submissionId, 'public');
        setResult(executionResult);

        if (isExecutionTerminal(executionResult)) {
          break;
        }

        await sleep(1000);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in to run or submit code.');
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Execution failed';
        setError(errorMsg);
      }
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  return { result, isRunning, error, runPublicTests };
};
