import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import apiClient from '../../lib/apiClient';

interface RawGroupedResponse {
  success: boolean;
  message?: string;
  data: Record<string, Array<{ id: string; title: string; difficulty?: string }>> | Array<any>;
}

interface ProblemItem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
}

export const ProblemExplorer: React.FC = () => {
  const [raw, setRaw] = useState<RawGroupedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiClient
      .get('/api/problems/grouped')
      .then((res) => {
        if (!mounted) return;
        setRaw(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message ?? err.message ?? 'Failed to load problems');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const flattenedProblems = useMemo<ProblemItem[]>(() => {
    if (!raw) return [];

    // If API returned an array already, normalize into category 'unknown'
    if (Array.isArray(raw.data)) {
      return raw.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        difficulty: (p.difficulty || 'UNKNOWN').toUpperCase(),
        category: (p.category as string) || 'unknown'
      }));
    }

    // Otherwise assume grouped by category
    const out: ProblemItem[] = [];
    Object.keys(raw.data || {}).forEach((category) => {
      const list = raw.data[category] || [];
      list.forEach((p) => {
        out.push({
          id: p.id,
          title: p.title,
          difficulty: (p.difficulty || 'UNKNOWN').toUpperCase(),
          category
        });
      });
    });

    return out;
  }, [raw]);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    flattenedProblems.forEach((p) => set.add(p.category || 'unknown'));
    return Array.from(set);
  }, [flattenedProblems]);

  const filteredProblems = useMemo(() => {
    return flattenedProblems.filter((p) => {
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      return true;
    });
  }, [flattenedProblems, difficultyFilter, categoryFilter]);

  const difficultyButtonClass = (active: boolean) =>
    active ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg px-3 py-1' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 rounded-lg px-3 py-1';

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'EASY':
        return 'text-blue-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      case 'HARD':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm text-zinc-400 shadow-2xl">Loading problems...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
        <div className="w-full max-w-xl rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400 shadow-2xl">
          <h1 className="text-lg font-semibold">Problems unavailable</h1>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-100">Problem Library</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Filter by difficulty">
              {['All', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={difficultyButtonClass(difficultyFilter === d)}
                  aria-pressed={difficultyFilter === d}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg p-2 focus:border-blue-500/20 focus:outline-none"
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-zinc-100">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead>
                <tr>
                  <th className="text-zinc-500 text-sm font-semibold border-b border-zinc-800 p-4 text-left">Title</th>
                  <th className="text-zinc-500 text-sm font-semibold border-b border-zinc-800 p-4 text-left">Category</th>
                  <th className="text-zinc-500 text-sm font-semibold border-b border-zinc-800 p-4 text-left">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer hover:bg-zinc-800 transition-all duration-200"
                    onClick={() => navigate(`/workspace/${p.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') navigate(`/workspace/${p.id}`);
                    }}
                  >
                    <td className="p-4 text-zinc-300 text-sm border-b border-zinc-800/50">
                      <div className="font-medium text-zinc-100 hover:text-blue-500 transition-colors duration-150">{p.title}</div>
                    </td>
                    <td className="p-4 text-zinc-300 text-sm border-b border-zinc-800/50">
                      <span className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-1 rounded-md text-xs">{p.category}</span>
                    </td>
                    <td className={`p-4 text-sm border-b border-zinc-800/50 ${difficultyColor(p.difficulty)}`}>{p.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProblemExplorer;
