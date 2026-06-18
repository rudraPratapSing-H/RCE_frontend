import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Play, CheckCircle2, XCircle, Code2, Trophy } from 'lucide-react';
import { getCompetitionLogs, CompetitionLogItem } from '../api/getCompetitionLogs';
import { CompetitionLeaderboard } from './CompetitionLeaderboard';

interface CompetitionDashboardProps {
  competitionId: string;
  onQuestionClick: (problemId: string) => void;
}

export const CompetitionDashboard: React.FC<CompetitionDashboardProps> = ({ 
  competitionId, 
  onQuestionClick 
}) => {
  const [logs, setLogs] = useState<CompetitionLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'leaderboard'>('questions');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const logsData = await getCompetitionLogs(competitionId);
        setLogs(logsData);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load competition questions:', err);
        setError(err.message || 'Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [competitionId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-80" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    if (status === 'Accepted') {
      return (
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-400/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Solved</span>
        </div>
      );
    }
    if (status === 'NOT_ATTEMPTED') {
      return (
        <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full text-xs font-medium border border-zinc-700">
          <Code2 className="h-3.5 w-3.5" />
          <span>Not Attempted</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-400/20">
        <XCircle className="h-3.5 w-3.5" />
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Competition Dashboard</h1>
        
        <div className="flex gap-2 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'questions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Questions
            </div>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'leaderboard'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'questions' ? (
        <div className="grid gap-4">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No questions available for this competition.
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.problemId}
                onClick={() => onQuestionClick(log.problemId)}
                className="group relative flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    log.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                    log.status === 'NOT_ATTEMPTED' ? 'bg-zinc-800 text-zinc-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {log.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      {renderStatusBadge(log.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-zinc-400 mb-0.5">Score</div>
                    <div className="font-mono font-medium text-zinc-200">
                      <span className={log.status === 'Accepted' ? 'text-emerald-400' : 'text-zinc-200'}>
                        {log.score}
                      </span>
                      <span className="text-zinc-600"> / {log.maxScore}</span>
                    </div>
                  </div>
                  
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-4 w-4 ml-0.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <CompetitionLeaderboard competitionId={competitionId} />
        </div>
      )}
    </div>
  );
};
