import React, { useEffect, useState } from 'react';
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
import type { RerunTestCase, TestCaseResult } from '../../types/testExecution';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

type LeftPanelTab = 'problem' | 'submission' | 'terminal';

interface WorkspaceProps {
  isCompetitionMode?: boolean;
  competitionId?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({ isCompetitionMode, competitionId }) => {

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

  // Left panel tab state: description, submissions, or terminal output.
  const [panel, setPanel] = useState<LeftPanelTab>('problem');
  const [selectedFailedCases, setSelectedFailedCases] = useState<RerunTestCase[]>([]);

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
    runPublicTests,
    selectedTestCases: selectedFailedCases
  });

  const handleSubmitCode = useHandlePrivateTestCases({
    problemId,
    language,
    code,
    competitionId,
    setLastAction,
    submitCode
  });

  const handleRunAndOpenTerminal = async () => {
    setPanel('terminal');
    await handleRunPublicTests();
  };

  const handleSubmitAndOpenTerminal = async () => {
    setPanel('terminal');
    await handleSubmitCode();
  };

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

  useEffect(() => {
    const status = currentResult?.status?.toLowerCase();
    if (status === 'accepted' || status === 'success') {
      setPanel('terminal');
    }
  }, [currentResult?.status]);

  useEffect(() => {
    setSelectedFailedCases([]);
  }, [problemId]);

  const handleAddFailedCase = (testCase: TestCaseResult) => {
    if (testCase.passed) return;

    const rerunCase: RerunTestCase = {
      caseId: testCase.caseId,
      input: testCase.input,
      expectedOutput: testCase.expected,
      testCaseData: {
        input: testCase.input,
        expectedOutput: testCase.expected
      }
    };

    setSelectedFailedCases((currentSelected) => {
      if (currentSelected.some((item) => item.caseId === rerunCase.caseId)) {
        return currentSelected;
      }

      return [...currentSelected, rerunCase];
    });
  };

  const canAddFailedCases = currentResult?.visibility === 'private';

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <WorkspaceToolbar
        language={language}
        setLanguage={setLanguage}
        onRun={handleRunAndOpenTerminal}
        onSubmit={handleSubmitAndOpenTerminal}
        isRunning={isRunning}
      />

      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden" autosaveId={isCompetitionMode ? "competition-workspace-v2" : "workspace-horizontal-v2"}>
        {/* Left side container: description, submissions, or terminal */}
        <Panel defaultSize={25} minSize={20} className="flex">
          <div className="flex h-full w-full flex-col overflow-hidden border-r border-zinc-800">
            <div className="flex gap-1.5 border-b border-zinc-800 bg-zinc-900 px-3 py-2">
              <button
                className={`rounded px-2.5 py-1 text-xs font-medium ${panel === 'problem' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                onClick={() => setPanel('problem')}
              >
                Description
              </button>
              {!isCompetitionMode && (
                <button
                  className={`rounded px-2.5 py-1 text-xs font-medium ${panel === 'submission' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                  onClick={() => setPanel('submission')}
                >
                  Submission
                </button>
              )}
              <button
                className={`rounded px-2.5 py-1 text-xs font-medium ${panel === 'terminal' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                onClick={() => setPanel('terminal')}
              >
                Terminal
              </button>
            </div>

            <div className="min-h-0 flex-1">
              {panel === 'problem' ? (
                <ProblemPanel problem={isLoading ? null : problem} />
              ) : panel === 'submission' ? (
                <Submission problemId={problemId} language={language} setCode={setCode} setLanguage={setLanguage} />
              ) : (
                <ConsolePanel
                  result={currentResult}
                  isRunning={isRunning}
                  error={error}
                  onAddFailedCase={canAddFailedCases ? handleAddFailedCase : undefined}
                  selectedCaseIds={canAddFailedCases ? selectedFailedCases.map((item) => item.caseId) : []}
                />
              )}
            </div>
          </div>
        </Panel>

        {/* Vertical resizing line (resizes horizontally) */}
        <PanelResizeHandle className="w-1.5 bg-zinc-950 hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-[col-resize]" />

        {/* Right side container: editor only */}
        <Panel defaultSize={75} minSize={30} className="flex flex-col border-l border-zinc-800">
          <EditorPanel language={language} code={code} setCode={setCode} />
        </Panel>
      </PanelGroup>
    </div>
  );
};
