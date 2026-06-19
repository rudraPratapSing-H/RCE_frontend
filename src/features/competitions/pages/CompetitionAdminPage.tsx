import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../navbar/Navbar';
import { useAuth } from '../../../hooks/useAuth';
import { CompetitionBasicInfo, getCompetitions } from '../api/getCompetitions';
import { Shield, Loader2, AlertCircle, Calendar, Clock, ChevronRight } from 'lucide-react';

export const CompetitionAdminPage: React.FC = () => {
  const [competitions, setCompetitions] = useState<CompetitionBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/');
      return;
    }

    const fetchCompetitions = async () => {
      try {
        const orgId = import.meta.env.VITE_ORGANIZATION_ID;
        if (!orgId) throw new Error('Organization ID is missing.');
        const data = await getCompetitions(orgId);
        setCompetitions(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load competitions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const getStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (now < start) return { label: 'Upcoming', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
    if (now > end) return { label: 'Ended', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' };
    return { label: 'Active', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Admin Panel</h1>
              <p className="mt-1 text-zinc-400">Manage competitions and view participant data.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/workspace/competitions')}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            ← Back to Competitions
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
        ) : competitions.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-gray-900/50 p-12 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="text-xl font-semibold text-zinc-300">No competitions found</h3>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-800/50 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Competition</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">End</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {competitions.map((comp) => {
                  const status = getStatus(comp.startTime, comp.endTime);
                  return (
                    <tr
                      key={comp.id}
                      className="hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      onClick={() => navigate(`/workspace/competitions/admin/${comp.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{comp.title}</div>
                        {comp.description && (
                          <div className="mt-1 text-xs text-zinc-500 line-clamp-1">{comp.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(comp.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(comp.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="ml-auto h-4 w-4 text-zinc-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
