import React from 'react';
import { Calendar, Clock, Trophy } from 'lucide-react';
import { CompetitionBasicInfo } from '../api/getCompetitions';

interface CompetitionCardProps {
  competition: CompetitionBasicInfo;
  onClick?: (id: string) => void;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onClick }) => {
  const startDate = new Date(competition.startTime.replace('Z', ''));
  const endDate = new Date(competition.endTime.replace('Z', ''));

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isUpcoming = new Date() < startDate;

  return (
    <div
      onClick={() => {
        if (!isUpcoming) {
          onClick?.(competition.id);
        }
      }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border p-6 shadow-sm backdrop-blur transition-all duration-300 ${
        isUpcoming 
          ? 'border-zinc-800 bg-gray-900/30 cursor-not-allowed opacity-80' 
          : 'cursor-pointer border-zinc-800 bg-gray-900/50 hover:border-blue-500/50 hover:bg-gray-800/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'
      }`}
    >
      {!isUpcoming && <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-blue-400 shadow-inner group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors duration-300">
            <Trophy className="h-5 w-5" />
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors duration-300">
            {competition.title}
          </h3>
          {competition.description && (
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
              {competition.description}
            </p>
          )}
        </div>
        {isUpcoming && (
          <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
            Upcoming
          </span>
        )}
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-3 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <span>Starts: <span className="font-medium text-zinc-300">{formatDateTime(startDate)}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-500" />
          <span>Ends: <span className="font-medium text-zinc-300">{formatDateTime(endDate)}</span></span>
        </div>
      </div>
    </div>
  );
};
