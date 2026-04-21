import type { ExecutionResult } from '../../../types/testExecution';
import type { WorkspaceAction } from '../types';

type Params = {
  publicResult: ExecutionResult | null;
  privateResult: ExecutionResult | null;
  isPublicRunning: boolean;
  isSubmitting: boolean;
  publicError: string | null;
  privateError: string | null;
  lastAction: WorkspaceAction;
};

export const useWorkspaceExecutionState = ({
  publicResult,
  privateResult,
  isPublicRunning,
  isSubmitting,
  publicError,
  privateError,
  lastAction
}: Params) => {
  let currentResult = privateResult || publicResult;
  if (lastAction === 'private') {
    currentResult = privateResult;
  } else if (lastAction === 'public') {
    currentResult = publicResult;
  }

  const isRunning = isPublicRunning || isSubmitting;

  let error = privateError || publicError;
  if (lastAction === 'private') {
    error = privateError;
  } else if (lastAction === 'public') {
    error = publicError;
  }

  return {
    currentResult,
    isRunning,
    error
  };
};
