import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProblemPanel } from './components/ProblemPanel';
import { EditorPanel } from './components/EditorPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { useProblem } from '../../hooks/useProblem';
import { usePublicTestCases } from '../../hooks/usePublicTestCases';
import { usePrivateTestCases } from '../../hooks/usePrivateTestCases';
import { useHandlePrivateTestCases } from './hooks/useHandlePrivateTestCases';
import { useHandlePublicTestCases } from './hooks/useHandlePublicTestCases';
import { useLatestSubmissionCode } from './hooks/useLatestSubmissionCode';
import { useProblemCodeState } from './hooks/useProblemCodeState';
import { useWorkspaceExecutionState } from './hooks/useWorkspaceExecutionState';
import type { WorkspaceAction } from './types';

export const Workspace: React.FC = () => {
  const { problemId = '' } = useParams<{ problemId: string }>();
  const { problem, isLoading } = useProblem(problemId);

  const [language, setLanguage] = useState('javascript');
  const [lastAction, setLastAction] = useState<WorkspaceAction>('none');
  const { latestSubmission } = useLatestSubmissionCode(problemId, language);
  const { code, setCode, driverCode, setDriverCode } = useProblemCodeState(
    problem,
    language,
    latestSubmission?.code ?? null
  );

  // Public test cases hook
  const {
    result: publicResult,
    isRunning: isPublicRunning,
    error: publicError,
    runPublicTests
  } = usePublicTestCases();

  // Private test cases hook
  const {
    result: privateResult,
    isSubmitting,
    error: privateError,
    submitCode
  } = usePrivateTestCases();

  const handleRunPublicTests = useHandlePublicTestCases({
    problemId,
    language,
    code,
    setLastAction,
    runPublicTests
  });

  const handleSubmitCode = useHandlePrivateTestCases({
    problemId,
    language,
    code,
    setLastAction,
    submitCode
  });

  const { currentResult, isRunning, error } = useWorkspaceExecutionState({
    publicResult,
    privateResult,
    isPublicRunning,
    isSubmitting,
    publicError,
    privateError,
    lastAction
  });

  // Driver code is managed with starter code state for future use in execution/editor wiring.
  void driverCode;
  void setDriverCode;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <WorkspaceToolbar
        language={language}
        setLanguage={setLanguage}
        onRun={handleRunPublicTests}
        onSubmit={handleSubmitCode}
        isRunning={isRunning}
      />

      <div className="flex flex-1 overflow-hidden">
        <ProblemPanel problem={isLoading ? null : problem} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <EditorPanel language={language} code={code} setCode={setCode} />
          <ConsolePanel result={currentResult} isRunning={isRunning} error={error} />
        </div>
      </div>
    </div>
  );
};
