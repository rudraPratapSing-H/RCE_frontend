import { useState, useEffect } from 'react';
import apiClient from '../../../lib/apiClient';

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

export function useAllSubmissions(problemId: string, language: string) {
	const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!problemId || !language) return;
		setLoading(true);
		setError(null);
		apiClient
			.get(`/api/dashboard/submissions/all/${problemId}`, { params: { language } })
			.then((res) => setSubmissions(res.data.submissions || []))
			.catch((err) => setError(err?.response?.data?.message || err.message))
			.finally(() => setLoading(false));
	}, [problemId, language]);

	return { submissions, loading, error };
}
