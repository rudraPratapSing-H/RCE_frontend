import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { WorkspaceAction } from '../types';

type Params = {
  problemId: string;
  language: string;
  code: string;
  setLastAction: Dispatch<SetStateAction<WorkspaceAction>>;
  runPublicTests: (problemId: string, language: string, code: string) => Promise<void>;
};

export const useHandlePublicTestCases = ({
  problemId,
  language,
  code,
  setLastAction,
  runPublicTests
}: Params) => {
  return useCallback(async () => {
    if (!problemId || !language || !code) {
      return;
    }

    setLastAction('public');
    await runPublicTests(problemId, language, code);
  }, [code, language, problemId, runPublicTests, setLastAction]);
};
