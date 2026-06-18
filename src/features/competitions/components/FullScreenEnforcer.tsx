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
  const [hasStarted, setHasStarted] = useState(!isMandatory);
  const [isCheatingWarning, setIsCheatingWarning] = useState(false);
  const [showToastWarning, setShowToastWarning] = useState(false);
  const cheatingLogTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToastWarning) {
      timer = setTimeout(() => {
        setShowToastWarning(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToastWarning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted) {
        if (isMandatory) setIsCheatingWarning(true);
        setShowToastWarning(true);
        
        // Debounce the cheat logging
        if (cheatingLogTimer.current) clearTimeout(cheatingLogTimer.current);
        cheatingLogTimer.current = setTimeout(() => {
          logCheatingAttempt(competitionId);
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [competitionId, hasStarted, isMandatory]);

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

  const isBlocking = isMandatory && !isFullscreen;

  return (
    <>
      {/* The actual content that is hidden behind the overlay when not fullscreen */}
      <div className={`${isBlocking ? 'pointer-events-none blur-sm select-none opacity-50' : ''} flex min-h-screen flex-col w-full transition-all duration-300`}>
        {children}
      </div>

      {/* The Blocking Overlay */}
      {isBlocking && (
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

      {/* The Toast Notification */}
      {showToastWarning && (
        <div className="fixed bottom-6 right-6 z-[10000] bg-red-600 border border-red-500 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm transition-all duration-300 transform translate-y-0 opacity-100">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-200" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">Cheating Attempt Logged</h4>
            <p className="text-xs text-red-100 mt-1">
              Switching tabs or minimizing the window is not allowed. This action has been recorded.
            </p>
          </div>
          <button 
            onClick={() => setShowToastWarning(false)} 
            className="ml-2 text-red-200 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
