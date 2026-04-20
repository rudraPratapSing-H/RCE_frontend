import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProblemPanel } from './components/ProblemPanel';
import { EditorPanel } from './components/EditorPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { useProblem } from '../../hooks/useProblem';
import { usePublicTestCases } from '../../hooks/usePublicTestCases';
import { usePrivateTestCases } from '../../hooks/usePrivateTestCases';

export const Workspace: React.FC = () => {
  const { problemId = '' } = useParams<{ problemId: string }>();
  const { problem, isLoading } = useProblem(problemId);

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [driverCode, setDriverCode] = useState('');
  const [lastAction, setLastAction] = useState('');

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

  const handleRunPublicTests = async () => {
    if (!problemId || !language || !code) {
      return;
    }
    setLastAction('public');
    await runPublicTests(problemId, language, code);
  };

  const handleSubmitCode = async () => {
    if (!problemId || !language || !code) {
      return;
    }
    setLastAction('private');
    await submitCode(problemId, language, code);
  };

  // Show the latest action's result to avoid stale private responses masking public runs.
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
