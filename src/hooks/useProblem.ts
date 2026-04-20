import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export type Problem = {
  id: string;
  title: string;
  description: string;
  starterCodes: Record<string, string>;
  driverCodes: Record<string, string>;
  publicTestCases: Array<{
    input: unknown;
    expectedOutput: unknown;
  }>;
};

type ApiProblem = {
  id: string;
  title: string;
  description: string;
  publicTestCases?: Array<{
    input?: unknown;
    expectedOutput?: unknown;
  }>;
  languageConfigs: Array<{
    language: string;
    starterCode: string;
    driverCode: string;
  }>;
};

export const useProblem = (problemId: string) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!problemId) {
      setProblem(null);
      return;
    }

    let isMounted = true;

    const fetchProblem = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<{ success: boolean; data: ApiProblem }>(`/api/problems/${problemId}`);
        const payload = response.data.data;

        const starterCodes = (payload.languageConfigs || []).reduce<Record<string, string>>((acc, config) => {
          acc[config.language] = config.starterCode;
          return acc;
        }, {});

        const driverCodes = (payload.languageConfigs || []).reduce<Record<string, string>>((acc, config) => {
          acc[config.language] = config.driverCode;
          return acc;
        }, {});

        if (isMounted) {
          const publicTestCases = (payload.publicTestCases || []).map((testCase) => ({
            input: testCase?.input,
            expectedOutput: testCase?.expectedOutput
          }));

          setProblem({
            id: payload.id,
            title: payload.title,
            description: payload.description,
            starterCodes,
            driverCodes,
            publicTestCases
          });
        }
      } catch {
        if (isMounted) {
          setProblem(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProblem();

    return () => {
      isMounted = false;
    };
  }, [problemId]);

  return { problem, isLoading };
};
