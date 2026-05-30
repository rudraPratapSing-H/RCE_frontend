import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { RerunTestCase } from '../../../types/testExecution';
import type { WorkspaceAction } from '../types';

type Params = {
  problemId: string;
  language: string;
  code: string;
  setLastAction: Dispatch<SetStateAction<WorkspaceAction>>;
  runPublicTests: (problemId: string, language: string, code: string, selectedTestCases?: RerunTestCase[]) => Promise<void>;
  selectedTestCases?: RerunTestCase[];
};

export const useHandlePublicTestCases = ({
  problemId,
  language,
  code,
  setLastAction,
  runPublicTests,
  selectedTestCases = []
}: Params) => {
  return useCallback(async () => {
    if (!problemId || !language || !code) {
      return;
    }

    setLastAction('public');
    await runPublicTests(problemId, language, code, selectedTestCases);
  }, [code, language, problemId, runPublicTests, selectedTestCases, setLastAction]);
};
