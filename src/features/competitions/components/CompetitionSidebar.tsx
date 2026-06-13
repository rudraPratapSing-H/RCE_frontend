import React from 'react';
import { CompetitionProblemBasic } from '../api/getCompetitionProblems';
import { ChevronRight, FileCode, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompetitionSidebarProps {
  problems: CompetitionProblemBasic[];
  competitionId: string;
  activeProblemId?: string;
}

export const CompetitionSidebar: React.FC<CompetitionSidebarProps> = ({ problems, competitionId, activeProblemId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex items-center border-b border-zinc-800 bg-zinc-900 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Questions</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {problems.map((problem, index) => {
          const isActive = activeProblemId === problem.id;
          return (
            <button
              key={problem.id}
              onClick={() => navigate(`/workspace/competitions/${competitionId}/problems/${problem.id}`)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                isActive ? 'bg-blue-500/10 border-l-2 border-blue-500 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-800 text-xs font-medium text-zinc-300">
                  {index + 1}
                </span>
                <div className="flex flex-col text-left">
                  <span className="truncate text-sm font-medium">{problem.title}</span>
                  <span className="text-xs text-zinc-500">{problem.score} points</span>
                </div>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />}
            </button>
          );
        })}
      </div>
      <div className="border-t border-zinc-800 p-4">
        <button
          onClick={() => navigate(`/workspace/competitions/${competitionId}/leaderboard`)}
          className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
            window.location.pathname.endsWith('/leaderboard')
              ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/50'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5" />
            <span className="font-medium text-sm">Leaderboard</span>
          </div>
          {window.location.pathname.endsWith('/leaderboard') && <ChevronRight className="h-4 w-4 opacity-70" />}
        </button>
      </div>
    </div>
  );
};
