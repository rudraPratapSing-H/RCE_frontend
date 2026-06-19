import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { CompetitionDashboard } from '../competitions/components/CompetitionDashboard';
import { startProblemTimer, pauseProblemTimer } from '../competitions/api/timeTracking';
import { getCompetitionLogs } from '../competitions/api/getCompetitionLogs';
import { FinishCompetitionButton } from '../competitions/components/FinishCompetitionButton';
import { X } from 'lucide-react';

import type { WorkspaceAction } from './types';
import type { RerunTestCase, TestCaseResult } from '../../types/testExecution';
import { Panel, Group, Separator } from 'react-resizable-panels';

type LeftPanelTab = 'problem' | 'submission' | 'terminal';

interface WorkspaceProps {
  competitionId?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({ competitionId }) => {

  const { problemId = '' } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { problem, isLoading } = useProblem(problemId);

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | undefined>(undefined);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [language, setLanguage] = useState('javascript');
  const [lastAction, setLastAction] = useState<WorkspaceAction>('none');
  const { latestSubmission } = useLatestSubmissionCode(problemId, language, !!competitionId);
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

  // Fetch initial timer
  useEffect(() => {
    if (!competitionId || !problemId) return;
    
    let isMounted = true;
    getCompetitionLogs(competitionId).then(logs => {
      if (!isMounted) return;
      const log = logs.find(l => l.problemId === problemId);
      if (log) {
        let elapsed = log.timeTaken || 0;
        if (log.lastStartedAt) {
          const past = new Date(log.lastStartedAt).getTime();
          elapsed += Math.floor((Date.now() - past) / 1000);
        }
        setTimerSeconds(elapsed);
      } else {
        setTimerSeconds(0);
      }
    }).catch(console.error);

    return () => { isMounted = false; };
  }, [competitionId, problemId]);

  // Start/Pause logic
  useEffect(() => {
    if (!competitionId || !problemId) return;

    let isActive = false;

    const start = () => {
      if (!isActive) {
        startProblemTimer(competitionId, problemId);
        setIsTimerRunning(true);
        isActive = true;
      }
    };

    const pause = () => {
      if (isActive) {
        pauseProblemTimer(competitionId, problemId);
        setIsTimerRunning(false);
        isActive = false;
      }
    };

    if (!isDashboardOpen) {
      start();
    } else {
      pause();
    }

    const handleBeforeUnload = () => {
      if (isActive) {
        navigator.sendBeacon(`/api/competitions/${competitionId}/problems/${problemId}/time/pause`);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      pause();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [competitionId, problemId, isDashboardOpen]);

  // Ticking visual timer
  useEffect(() => {
    if (!isTimerRunning || timerSeconds === undefined) return;
    const interval = setInterval(() => {
      setTimerSeconds(s => (s !== undefined ? s + 1 : s));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

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
    <div className="flex h-full flex-col overflow-hidden bg-zinc-950 text-zinc-100 relative">
      <WorkspaceToolbar
        language={language}
        setLanguage={setLanguage}
        onRun={handleRunAndOpenTerminal}
        onSubmit={handleSubmitAndOpenTerminal}
        isRunning={isRunning}
        competitionId={competitionId}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        timerSeconds={timerSeconds}
      />

      {isDashboardOpen && competitionId && (
        <div className="absolute inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-md">
          <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <FinishCompetitionButton 
              competitionId={competitionId} 
            />
            <button 
              onClick={() => setIsDashboardOpen(false)}
              className="rounded-full bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto px-6 pb-6 pt-4">
            <CompetitionDashboard 
              competitionId={competitionId} 
              onQuestionClick={(newProblemId) => {
                setIsDashboardOpen(false);
                navigate(`/workspace/${newProblemId}?competitionId=${competitionId}`, {
                  state: location.state // preserve fullscreen and timer state
                });
              }} 
            />
          </div>
        </div>
      )}

      <Group direction="horizontal" className="flex-1 overflow-hidden" autoSaveId="workspace-horizontal-v3">
        {/* Left side container: description, submissions, or terminal */}
        <Panel id="workspace-left-panel" defaultSize={40} minSize={20} className="flex">
          <div className="flex h-full w-full flex-col overflow-hidden border-r border-zinc-800">
            <div className="flex gap-1.5 border-b border-zinc-800 bg-zinc-900 px-3 py-2">
              <button
                className={`rounded px-2.5 py-1 text-xs font-medium ${panel === 'problem' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                onClick={() => setPanel('problem')}
              >
                Description
              </button>
              {!competitionId && (
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

            <div className="min-h-0 min-w-0 flex-1">
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
        <Separator className="w-1.5 bg-zinc-950 hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-[col-resize]" />

        {/* Right side container: editor only */}
        <Panel id="workspace-right-panel" defaultSize={60} minSize={30} className="flex flex-col border-l border-zinc-800">
          <EditorPanel language={language} code={code} setCode={setCode} />
        </Panel>
      </Group>
    </div>
  );
};
