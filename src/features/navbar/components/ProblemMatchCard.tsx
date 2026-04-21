import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProblemSearchResult } from '../types';

type ProblemMatchCardProps = {
  problem: ProblemSearchResult;
  matchType: 'exact' | 'fuzzy';
  onSelect?: () => void;
};

const formatDifficulty = (difficulty: string) => {
  const normalized = difficulty.trim().toLowerCase();
  if (!normalized) return 'Unknown';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const difficultyStyles: Record<string, string> = {
  easy: 'border-green-500/20 bg-green-500/10 text-green-400',
  medium: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
  hard: 'border-red-500/20 bg-red-500/10 text-red-400'
};

export const ProblemMatchCard: React.FC<ProblemMatchCardProps> = ({ problem, matchType, onSelect }) => {
  const navigate = useNavigate();
  const difficultyKey = problem.difficulty.trim().toLowerCase();
  const difficultyClass = difficultyStyles[difficultyKey] || 'border-zinc-700 bg-zinc-800/80 text-zinc-200';

  const handleClick = () => {
    onSelect?.();
    navigate(`/workspace/${problem.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-left transition-colors hover:bg-zinc-900"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-zinc-100">{problem.title}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {matchType === 'exact' ? 'Exact match' : `Fuzzy match · score ${(problem.similarityScore * 100).toFixed(0)}%`}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${difficultyClass}`}>
          {formatDifficulty(problem.difficulty)}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">Open</span>
      </div>
    </button>
  );
};