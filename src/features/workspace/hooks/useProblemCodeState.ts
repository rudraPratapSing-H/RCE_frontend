import { useEffect, useState } from 'react';
import type { Problem } from '../../../hooks/useProblem';

export const useProblemCodeState = (
  problem: Problem | null,
  language: string,
  savedCode: string | null = null
) => {
  const [code, setCode] = useState('');
  const [driverCode, setDriverCode] = useState('');

  useEffect(() => {
    if (!problem) return;

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
  }, [language, problem]);

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
