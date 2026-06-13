import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../navbar/Navbar';
import { Workspace } from '../../workspace/Workspace';
import { CompetitionSidebar } from '../components/CompetitionSidebar';
import { CompetitionDetails, getCompetitionProblems } from '../api/getCompetitionProblems';
import { CompetitionLeaderboard } from '../components/CompetitionLeaderboard';
import { useAuth } from '../../../hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

export const CompetitionWorkspacePage: React.FC = () => {
  const { competitionId, problemId } = useParams<{ competitionId: string; problemId?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [details, setDetails] = useState<CompetitionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/');
      return;
    }

    if (!competitionId) return;

    const fetchDetails = async () => {
      try {
        const data = await getCompetitionProblems(competitionId);
        setDetails(data);
        setError(null);

        // Check if it's already ended
        if (new Date() > new Date(data.endTime)) {
          setHasEnded(true);
        }

        // Auto-redirect to the first problem if none selected
        if (!problemId && data.problems.length > 0) {
          navigate(`/workspace/competitions/${competitionId}/problems/${data.problems[0].id}`, { replace: true });
        }
      } catch (err: any) {
        console.error('Failed to load competition details:', err);
        setError(err.message || 'Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [competitionId, problemId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-gray-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-80" />
            <p>{error || 'Competition not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-zinc-100 overflow-hidden">
      <Navbar 
        competitionTimer={{
          startTime: details.startTime,
          endTime: details.endTime,
          onTimerEnd: () => setHasEnded(true)
        }} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <CompetitionSidebar 
          problems={details.problems} 
          competitionId={competitionId!} 
          activeProblemId={problemId} 
        />
        
        <div className="flex-1 relative">
          {window.location.pathname.endsWith('/leaderboard') ? (
            <CompetitionLeaderboard competitionId={competitionId!} />
          ) : problemId ? (
            <>
              <Workspace isCompetitionMode competitionId={competitionId} />
              {hasEnded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm">
                  <div className="rounded-xl border border-zinc-800 bg-gray-900 p-8 text-center shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Competition Ended</h2>
                    <p className="text-zinc-400">The time for this competition has expired.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              Select a question from the sidebar to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
