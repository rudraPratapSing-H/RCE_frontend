import React, { useEffect, useState } from 'react';
import { X, Loader2, Mail, User, Clock, CheckCircle2, XCircle, Code2 } from 'lucide-react';
import { getParticipantDetails, ParticipantDetail } from '../api/getParticipantDetails';

interface ParticipantDetailModalProps {
  competitionId: string;
  participantId: string;
  onClose: () => void;
}

export const ParticipantDetailModal: React.FC<ParticipantDetailModalProps> = ({
  competitionId,
  participantId,
  onClose
}) => {
  const [detail, setDetail] = useState<ParticipantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getParticipantDetails(competitionId, participantId);
        setDetail(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load participant details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [competitionId, participantId]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Accepted') {
      return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400"><CheckCircle2 className="h-3 w-3" />Accepted</span>;
    }
    if (status === 'NOT_ATTEMPTED') {
      return <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400"><Code2 className="h-3 w-3" />Not Attempted</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-400/10 px-2 py-0.5 text-xs font-medium text-rose-400"><XCircle className="h-3 w-3" />{status}</span>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Participant Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">{error}</div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-300">{detail.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-300">{detail.email}</span>
                  </div>
                </div>
              </div>

              {/* Per-question breakdown */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Question Breakdown</h3>
                <div className="space-y-3">
                  {detail.questions.map((q, idx) => (
                    <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-800/30 overflow-hidden">
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-zinc-100">{q.problemTitle}</span>
                          {getStatusBadge(q.status)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(q.timeTaken)}
                          </div>
                          <span className="font-mono font-medium text-zinc-300">Score: {q.score}</span>
                          <span className="text-zinc-600">{expandedQuestion === idx ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {expandedQuestion === idx && (
                        <div className="border-t border-zinc-800 p-4">
                          {q.submittedCode ? (
                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase text-zinc-500">Submitted Code</span>
                                <div className="flex items-center gap-2">
                                  {q.language && (
                                    <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{q.language}</span>
                                  )}
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(q.submittedCode || '');
                                      // Optional: Add a temporary toast or icon change here if desired
                                    }}
                                    className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                                    title="Copy code"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                    Copy
                                  </button>
                                </div>
                              </div>
                              <pre className="max-h-64 overflow-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 text-xs text-zinc-300 font-mono leading-relaxed">
                                <code>{q.submittedCode}</code>
                              </pre>
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-500 italic">No code submitted for this question.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
