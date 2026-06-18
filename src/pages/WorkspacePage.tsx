import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Navbar } from '../features/navbar/Navbar';
import { Workspace } from '../features/workspace/Workspace';
import ProblemExplorer from '../components/problems/ProblemExplorer';
import { FullScreenEnforcer } from '../features/competitions/components/FullScreenEnforcer';

export const WorkspacePage: React.FC = () => {
  const { problemId } = useParams<{ problemId?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const competitionId = searchParams.get('competitionId') || undefined;
  const fullScreenMandatory = location.state?.fullScreenMandatory || false;
  const startTime = location.state?.startTime;
  const endTime = location.state?.endTime;
  
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (endTime && new Date() > new Date(endTime.replace('Z', ''))) {
      setHasEnded(true);
    }
  }, [endTime]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!problemId) {
    return (
      <div className="min-h-screen bg-gray-950 text-zinc-100">
        <Navbar />
        <ProblemExplorer />
      </div>
    );
  }

  const content = (
    <div className="flex h-screen flex-col bg-gray-950 text-zinc-100 overflow-hidden relative">
      {hasEnded && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Competition Ended</h2>
            <p className="text-zinc-400 mb-6">The time for this competition has expired.</p>
            <button
              onClick={() => window.location.href = `/workspace/competitions/${competitionId}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
      <div className={competitionId && isBrowserFullscreen ? 'hidden' : 'block'}>
        <Navbar 
          competitionTimer={startTime && endTime ? {
            startTime,
            endTime,
            onTimerEnd: () => setHasEnded(true)
          } : undefined}
        />
      </div>
      <div className="flex-1 overflow-hidden relative">
        <Workspace competitionId={competitionId} />
      </div>
    </div>
  );

  if (competitionId && fullScreenMandatory) {
    return (
      <FullScreenEnforcer competitionId={competitionId} isMandatory={fullScreenMandatory}>
        {content}
      </FullScreenEnforcer>
    );
  }

  return content;
};
