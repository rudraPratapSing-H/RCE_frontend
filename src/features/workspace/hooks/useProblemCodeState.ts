import { useEffect, useState, useRef } from 'react';
import type { Problem } from '../../../hooks/useProblem';
import { useParams } from 'react-router-dom';

export const useProblemCodeState = (
  problem: Problem | null,
  language: string,
  savedCode: string | null = null,
  setLanguage?: (lang: string) => void
) => {
  const { problemId } = useParams<{ problemId: string }>();
  const [code, setCode] = useState('');
  const [driverCode, setDriverCode] = useState('');
  const hasLoadedDraft = useRef(false); // Track if we've already loaded the draft

  // Initial Code Setup
  useEffect(() => {
    if (!problem) return;

    // ONLY attempt to load the draft once per problem load
    if (problemId && !hasLoadedDraft.current) {
      hasLoadedDraft.current = true;
      const draftItem = localStorage.getItem(`draft_${problemId}`);
      if (draftItem) {
        try {
          const draft = JSON.parse(draftItem);
          if (draft.language && setLanguage) setLanguage(draft.language);
          if (draft.code) {
            setCode(draft.code);
            return; // Skip setting from starter code because draft overrides
          }
        } catch (e) {
          console.error("Failed to parse draft code", e);
        }
      }
    }

    // If we switch languages naturally (or there was no draft), load the starter code
    const nextStarterCode =
      problem.starterCodes[language] ||
      problem.starterCodes.javascript ||
      Object.values(problem.starterCodes)[0] ||
      '';

    const nextDriverCode =
      problem.driverCodes[language] ||
      problem.driverCodes.javascript ||
      Object.values(problem.driverCodes)[0] ||
      '';

    setCode(nextStarterCode);
    setDriverCode(nextDriverCode);
  }, [language, problem, problemId, setLanguage]);

  // Persist code draft incrementally
  useEffect(() => {
    if (!code || !problemId) return;

    const timer = setTimeout(() => {
      localStorage.setItem(
        `draft_${problemId}`,
        JSON.stringify({
          language,
          code,
          timestamp: Date.now()
        })
      );
    }, 1000); // This is your 1-second debounce

    return () => clearTimeout(timer);
  }, [code, language, problemId]);

  useEffect(() => {
    if (savedCode !== null) {
      setCode(savedCode);
    }
  }, [savedCode]);

  return {
    code,
    setCode,
    driverCode,
    setDriverCode
  };
};