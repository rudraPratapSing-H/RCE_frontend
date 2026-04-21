import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { WorkspaceAction } from '../types';

type Params = {
  problemId: string;
  language: string;
  code: string;
  setLastAction: Dispatch<SetStateAction<WorkspaceAction>>;
  submitCode: (problemId: string, language: string, code: string) => Promise<void>;
};

export const useHandlePrivateTestCases = ({
  problemId,
  language,
  code,
  setLastAction,
  submitCode
}: Params) => {
  return useCallback(async () => {
    if (!problemId || !language || !code) {
      return;
    }

    setLastAction('private');
    await submitCode(problemId, language, code);
  }, [code, language, problemId, setLastAction, submitCode]);
};
