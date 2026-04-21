import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  starterCodes: Record<string, string>;
  driverCodes: Record<string, string>;
  publicTestCases: Array<Record<string, unknown> & {
    input?: unknown;
    expectedOutput?: unknown;
  }>;
};

type ApiProblem = {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  publicTestCases?: Array<{
    [key: string]: unknown;
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

        const deriveInputFromObject = (value: unknown): unknown => {
          if (!value || typeof value !== 'object' || Array.isArray(value)) return '';

          const entries = Object.entries(value as Record<string, unknown>);
          if (entries.length === 0) return '';

          const firstNonExpected = entries.find(([key]) => key !== 'expectedOutput');
          if (firstNonExpected) return firstNonExpected[1];

          return entries[0][1];
        };

        if (isMounted) {
          const publicTestCases = (payload.publicTestCases || []).map((testCase) => ({
            ...testCase,
            input: testCase?.input ?? deriveInputFromObject(testCase),
            expectedOutput: testCase?.expectedOutput
          }));

          setProblem({
            id: payload.id,
            title: payload.title,
            description: payload.description,
            difficulty: payload.difficulty || 'Unknown',
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
