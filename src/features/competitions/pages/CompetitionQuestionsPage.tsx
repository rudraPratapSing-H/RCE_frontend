import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../navbar/Navbar';
import { useAuth } from '../../../hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { FullScreenEnforcer } from '../components/FullScreenEnforcer';
import { registerForCompetition } from '../api/registerForCompetition';
import { CompetitionDashboard } from '../components/CompetitionDashboard';

export const CompetitionQuestionsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [fullScreenMandatory, setFullScreenMandatory] = useState(false);
  const [competitionTimes, setCompetitionTimes] = useState<{ startTime: string, endTime: string } | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/');
      return;
    }

    if (!competitionId) return;

    const initializeCompetition = async () => {
      try {
        setLoading(true);
        // 1. Auto-register first (idempotent)
        const regResponse = await registerForCompetition(competitionId);
        setFullScreenMandatory(regResponse.fullScreenMandatory);
        setCompetitionTimes({ startTime: regResponse.startTime, endTime: regResponse.endTime });

        if (new Date() > new Date(regResponse.endTime.replace('Z', ''))) {
          setHasEnded(true);
        }

        setError(null);
      } catch (err: any) {
        console.error('Failed to load competition questions:', err);
        setError(err.message || 'Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    initializeCompetition();
  }, [competitionId, isAuthenticated, navigate]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Check initial
    handleFullscreenChange();
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleQuestionClick = (problemId: string) => {
    navigate(`/workspace/${problemId}?competitionId=${competitionId}`, { 
      state: { 
        fullScreenMandatory,
        startTime: competitionTimes?.startTime,
        endTime: competitionTimes?.endTime
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-80" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FullScreenEnforcer 
      competitionId={competitionId!} 
      isMandatory={fullScreenMandatory}
    >
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <div className={isBrowserFullscreen ? 'hidden' : 'block'}>
          <Navbar 
            competitionTimer={competitionTimes ? {
              startTime: competitionTimes.startTime,
              endTime: competitionTimes.endTime,
              onTimerEnd: () => setHasEnded(true)
            } : undefined}
          />
        </div>
        
        <main className="flex-1 overflow-auto p-6 lg:p-8 relative">
          {hasEnded && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2">Competition Ended</h2>
                <p className="text-zinc-400">The time for this competition has expired.</p>
              </div>
            </div>
          )}
          
          <CompetitionDashboard 
            competitionId={competitionId!} 
            onQuestionClick={handleQuestionClick} 
          />
        </main>
      </div>
    </FullScreenEnforcer>
  );
};
