import React, { useEffect, useState, useRef } from 'react';
import { logCheatingAttempt } from '../api/logCheating';
import { Maximize, AlertTriangle } from 'lucide-react';

interface FullScreenEnforcerProps {
  competitionId: string;
  isMandatory: boolean;
  children: React.ReactNode;
}

export const FullScreenEnforcer: React.FC<FullScreenEnforcerProps> = ({
  competitionId,
  isMandatory,
  children
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCheatingWarning, setIsCheatingWarning] = useState(false);
  const cheatingLogTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isMandatory) return;

    const handleFullscreenChange = () => {
      const currentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(currentlyFullscreen);

      if (hasStarted && !currentlyFullscreen) {
        setIsCheatingWarning(true);
        // Debounce the cheat logging slightly to avoid double-firing on rapid toggles
        if (cheatingLogTimer.current) clearTimeout(cheatingLogTimer.current);
        cheatingLogTimer.current = setTimeout(() => {
          logCheatingAttempt(competitionId);
        }, 500);
      } else if (currentlyFullscreen) {
        setIsCheatingWarning(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Check initial state
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (cheatingLogTimer.current) clearTimeout(cheatingLogTimer.current);
    };
  }, [competitionId, hasStarted, isMandatory]);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setHasStarted(true);
      }
    } catch (err) {
      console.error("Failed to enter fullscreen", err);
      alert("Your browser blocked fullscreen mode. Please try again or check site permissions.");
    }
  };

  if (!isMandatory) {
    return <>{children}</>;
  }

  return (
    <>
      {/* The actual content that is hidden behind the overlay when not fullscreen */}
      <div className={`${!isFullscreen ? 'pointer-events-none blur-sm select-none opacity-50' : ''} flex min-h-screen flex-col w-full transition-all duration-300`}>
        {children}
      </div>

      {/* The Blocking Overlay */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md">
          <div className="max-w-md text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
            {isCheatingWarning ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Warning: Cheating Detected</h2>
                <p className="text-zinc-400 mb-6">
                  You have exited full-screen mode during a strict competition. 
                  This incident has been recorded. Repeated attempts may lead to disqualification.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 mb-6">
                  <Maximize className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Full Screen Required</h2>
                <p className="text-zinc-400 mb-6">
                  This competition requires full-screen mode to prevent cheating. 
                  Please enter full-screen to begin.
                </p>
              </>
            )}

            <button
              onClick={requestFullscreen}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Maximize className="h-5 w-5" />
              {isCheatingWarning ? "Return to Full Screen" : "Enter Competition"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
