import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProblemPanel } from './components/ProblemPanel';
import Submission from './components/Submission';
import { EditorPanel } from './components/EditorPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { WorkspaceToolbar } from './hooks/WorkspaceToolbar';
import { useProblem } from '../../hooks/useProblem';
import { usePublicTestCases } from '../../hooks/usePublicTestCases';
import { usePrivateTestCases } from '../../hooks/usePrivateTestCases';
import { useHandlePrivateTestCases } from './hooks/useHandlePrivateTestCases';
import { useHandlePublicTestCases } from './hooks/useHandlePublicTestCases';
import { useLatestSubmissionCode } from './hooks/useLatestSubmissionCode';
import { useProblemCodeState } from './hooks/useProblemCodeState';
import { useWorkspaceExecutionState } from './hooks/useWorkspaceExecutionState';

import type { WorkspaceAction } from './types';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

export const Workspace: React.FC = () => {

  const { problemId = '' } = useParams<{ problemId: string }>();
  const { problem, isLoading } = useProblem(problemId);

  const [language, setLanguage] = useState('javascript');
  const [lastAction, setLastAction] = useState<WorkspaceAction>('none');
  const { latestSubmission } = useLatestSubmissionCode(problemId, language);
  const { code, setCode, driverCode, setDriverCode } = useProblemCodeState(
    problem,
    language,
    latestSubmission?.code ?? null,
    setLanguage
  );

  // Toggle state: 'problem' or 'submission'
  const [panel, setPanel] = useState<'problem' | 'submission'>('problem');

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

      {/* Toggle buttons for Problem/Submission panel */}
      <div className="flex gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <button
          className={`px-3 py-1 rounded ${panel === 'problem' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
          onClick={() => setPanel('problem')}
        >
          Problem
        </button>
        <button
          className={`px-3 py-1 rounded ${panel === 'submission' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
          onClick={() => setPanel('submission')}
        >
          Submission
        </button>
      </div>

      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden" autosaveid="workspace-horizontal">
        {/* 1. ProblemPanel or Submission: 45% width */}
        <Panel defaultSize={30} minSize={20} className="flex">
          {panel === 'problem' ? (
            <ProblemPanel problem={isLoading ? null : problem} />
          ) : (
            <Submission problemId={problemId} language={language} setCode={setCode} setLanguage={setLanguage} />
          )}
        </Panel>

        {/* Vertical resizing line (resizes horizontally) */}
        <PanelResizeHandle className="w-1.5 bg-zinc-950 hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-[col-resize]" />

        {/* Right side container: remaining 55% width */}
        <Panel defaultSize={70} minSize={30} className="flex flex-col border-l border-zinc-800">
          <PanelGroup direction="vertical" autosaveid="workspace-vertical">
            {/* 2. EditorPanel: 60% height on top */}
            <Panel defaultSize={60} minSize={20} className="flex flex-col">
              <EditorPanel language={language} code={code} setCode={setCode} />
            </Panel>

            {/* Horizontal resizing line (resizes vertically) */}
            <PanelResizeHandle className="h-1.5 bg-zinc-950 hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-[row-resize]" />

            {/* 3. ConsolePanel: remaining 40% height on bottom */}
            <Panel defaultSize={40} minSize={10} className="flex flex-col border-t border-zinc-800">
              <ConsolePanel result={currentResult} isRunning={isRunning} error={error} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};
