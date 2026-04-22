import { useRef, useState } from 'react';
import { ExecutionResult } from '../types/testExecution';
import apiClient from '../lib/apiClient';
import { isExecutionTerminal, mapStatusToExecutionResult } from './executionResultMapper';

interface UsePrivateTestCasesReturn {
  result: ExecutionResult | null;
  isSubmitting: boolean;
  error: string | null;
  submitCode: (problemId: string, language: string, code: string) => Promise<void>;
  checkSubmissionStatus: (submissionId: string) => Promise<ExecutionResult | null>;
}

export const usePrivateTestCases = (): UsePrivateTestCasesReturn => {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activePollTokenRef = useRef(0);

  const stopExistingPoll = () => {
    activePollTokenRef.current += 1;
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const submitCode = async (problemId: string, language: string, code: string) => {
    try {
      stopExistingPoll();
      const pollToken = activePollTokenRef.current;
      setIsSubmitting(true);
      setError(null);
      setResult(null);

      const response = await apiClient.post('/api/execute', {
        problemId,
        language,
        code
      });

      // Backend returns { submissionId, status: 'Pending' }
      // We need to poll for results
      const { submissionId } = response.data;
      if (!submissionId) {
        throw new Error('Submission ID missing in execute response.');
      }

      const startTime = Date.now();
      let finalResult = null;
      while (activePollTokenRef.current === pollToken) {
        const statusResponse = await apiClient.get(`/api/status/${submissionId}`);
        const executionResult = mapStatusToExecutionResult(statusResponse.data, submissionId, 'private');
        setResult(executionResult);

        if (isExecutionTerminal(executionResult)) {
          finalResult = executionResult;
          break;
        }

        if (Date.now() - startTime > 5 * 60 * 1000) {
          throw new Error('Submission timed out while waiting for final status.');
        }

        await sleep(1000);
      }

      if (finalResult && finalResult.status === 'Accepted') {
        localStorage.removeItem(`draft_${problemId}`);
      }

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in to run or submit code.');
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Submission failed';
        setError(errorMsg);
      }
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkSubmissionStatus = async (submissionId: string): Promise<ExecutionResult | null> => {
    try {
      const response = await apiClient.get(`/api/status/${submissionId}`);
      return mapStatusToExecutionResult(response.data, submissionId, 'private');
    } catch (err) {
      console.error('Status fetch error:', err);
      return null;
    }
  };

  return { result, isSubmitting, error, submitCode, checkSubmissionStatus };
};
