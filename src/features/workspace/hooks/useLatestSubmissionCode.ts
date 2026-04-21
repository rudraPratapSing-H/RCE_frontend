import { useEffect, useState } from 'react';
import apiClient from '../../../lib/apiClient';

type LatestSubmission = {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  problemId: string;
  language: string;
};

type LatestSubmissionResponse = {
  success: boolean;
  data: LatestSubmission | null;
};

export const useLatestSubmissionCode = (problemId: string, language: string) => {
  const [latestSubmission, setLatestSubmission] = useState<LatestSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId || !language) {
      setLatestSubmission(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchLatestSubmission = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<LatestSubmissionResponse>('/api/submissions/latest', {
          params: {
            problemId,
            language
          }
        });

        if (cancelled) return;

        setLatestSubmission(response.data.data ?? null);
      } catch (fetchError: any) {
        if (cancelled) return;

        setLatestSubmission(null);
        setError(fetchError?.response?.data?.message || fetchError?.message || 'Failed to load latest submission.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchLatestSubmission();

    return () => {
      cancelled = true;
    };
  }, [problemId, language]);

  return {
    latestSubmission,
    isLoading,
    error
  };
};
