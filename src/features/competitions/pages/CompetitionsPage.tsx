import React, { useEffect, useState } from 'react';
import { Navbar } from '../../navbar/Navbar';
import { CompetitionBasicInfo, getCompetitions } from '../api/getCompetitions';
import { CompetitionCard } from '../components/CompetitionCard';
import { Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export const CompetitionsPage: React.FC = () => {
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
        if (!orgId) {
          throw new Error('Organization ID is missing in environment variables.');
        }

        const data = await getCompetitions(orgId);
        setCompetitions(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch competitions:', err);
        setError(err.message || 'Failed to load competitions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleCompetitionClick = (id: string) => {
    navigate(`/workspace/competitions/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-zinc-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Competitions</h1>
            <p className="mt-1 text-zinc-400">Join and compete in active coding challenges.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-80" />
            <p>{error}</p>
          </div>
        ) : competitions.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-gray-900/50 p-12 text-center backdrop-blur">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="text-xl font-semibold text-zinc-300">No active competitions</h3>
            <p className="mt-2 text-zinc-500">Check back later for new coding challenges.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp) => (
              <CompetitionCard
                key={comp.id}
                competition={comp}
                onClick={handleCompetitionClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
