import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../navbar/Navbar';
import { useAuth } from '../../../hooks/useAuth';
import { getAdminParticipants, AdminParticipant } from '../api/getAdminParticipants';
import { ParticipantDetailModal } from '../components/ParticipantDetailModal';
import { Loader2, AlertCircle, Users, ArrowLeft, Trophy, Clock, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

export const CompetitionAdminDetailPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [participants, setParticipants] = useState<AdminParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/');
      return;
    }
    if (!competitionId) return;

    const fetchParticipants = async () => {
      try {
        const data = await getAdminParticipants(competitionId);
        setParticipants(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [competitionId, isAuthenticated]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Participants</h1>
              <p className="mt-1 text-zinc-400">
                {loading ? 'Loading...' : `${participants.length} participant${participants.length !== 1 ? 's' : ''} registered`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/workspace/competitions/admin')}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-80" />
            <p>{error}</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-gray-900/50 p-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="text-xl font-semibold text-zinc-300">No participants yet</h3>
            <p className="mt-2 text-zinc-500">No one has registered for this competition yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {participants.map((p) => (
              <div
                key={p.participantId}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all"
              >
                {/* Card header */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{p.username}</h3>
                    <p className="text-xs text-zinc-500">{p.email}</p>
                  </div>
                  {p.finished && (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      Finished
                    </span>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                      <Trophy className="h-3 w-3" />
                      Score
                    </div>
                    <div className="text-lg font-bold text-blue-400">{p.score}</div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                      <Clock className="h-3 w-3" />
                      Time
                    </div>
                    <div className="text-lg font-bold font-mono text-zinc-300">{formatTime(p.totalTimeTaken)}</div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Accepted
                    </div>
                    <div className="text-lg font-bold text-emerald-400">
                      {p.questionsAccepted}<span className="text-sm text-zinc-600"> / {p.totalQuestions}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      Cheating
                    </div>
                    <div className={`text-lg font-bold ${p.cheatingAttempts > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                      {p.cheatingAttempts}
                    </div>
                  </div>
                </div>

                {/* View details button */}
                <button
                  onClick={() => setSelectedParticipantId(p.participantId)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Participant detail modal */}
        {selectedParticipantId && competitionId && (
          <ParticipantDetailModal
            competitionId={competitionId}
            participantId={selectedParticipantId}
            onClose={() => setSelectedParticipantId(null)}
          />
        )}
      </main>
    </div>
  );
};
