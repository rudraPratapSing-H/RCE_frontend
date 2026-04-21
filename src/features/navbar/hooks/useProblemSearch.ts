import { useEffect, useState } from 'react';
import apiClient from '../../../lib/apiClient';
import type { ProblemSearchResponse, ProblemSearchResult } from '../types';

type UseProblemSearchResult = {
  results: ProblemSearchResult[];
  matchType: 'exact' | 'fuzzy' | 'none';
  isLoading: boolean;
  error: string | null;
};

export const useProblemSearch = (query: string): UseProblemSearchResult => {
  const [results, setResults] = useState<ProblemSearchResult[]>([]);
  const [matchType, setMatchType] = useState<'exact' | 'fuzzy' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');

    if (!normalizedQuery) {
      setResults([]);
      setMatchType('none');
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<ProblemSearchResponse>('/api/problems/search', {
          params: { q: normalizedQuery }
        });

        if (cancelled) return;

        setResults(response.data.data || []);
        setMatchType(response.data.matchType || 'none');
      } catch (err: any) {
        if (cancelled) return;

        setResults([]);
        setMatchType('none');
        setError(err?.response?.data?.message || err?.message || 'Failed to search problems.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  return { results, matchType, isLoading, error };
};