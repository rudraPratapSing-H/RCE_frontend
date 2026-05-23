import { useEffect, useState } from "react";
import apiClient from "../../../lib/apiClient";

export interface SubmissionData {
  id: string;
  status: string;
  language: string;
  code: string;
  errorMessage: string | null;
  executionTimeMs: number | null;
  memoruUsedKb: number | null;
  testCasesPassed: number | null;
  totalTestCases: number | null;
  createdAt: string;
}

export function useLatestSubmission(problemId: string | undefined) {
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/dashboard/submissions/latest/${problemId}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [problemId]);

  return { data, loading, error };
}
