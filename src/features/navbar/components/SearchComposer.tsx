import React, { useMemo, useState, useContext } from 'react';
import { SearchBar } from '../../../components/ui/SearchBar';
import { useProblemSearch } from '../hooks/useProblemSearchAutoComplete';
import { ProblemMatchCard } from './ProblemMatchCard';
import { ProblemContext } from '../../../context/ProblemContext'; // Import your context

export const SearchComposer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Grab the data you ALREADY fetched at the app level
  const { problems, isLoading: isContextLoading } = useContext(ProblemContext);

  // Pass it into our hook
  const { results, matchType, isLoading: isSearchLoading, error } = useProblemSearch(query, problems);

  const hasContent = useMemo(() => query.trim().length > 0, [query]);

  return (
    <div className="relative w-full max-w-md">
      <SearchBar
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 150);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        placeholder="Search problems by title"
        aria-label="Search problems"
      />

      {isOpen && hasContent && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
          {(isContextLoading || isSearchLoading) && (
            <p className="px-3 py-2 text-sm text-zinc-500">Searching problems...</p>
          )}

          {!isContextLoading && !isSearchLoading && error && (
            <p className="px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          {!isContextLoading && !isSearchLoading && !error && results.length === 0 && (
            <p className="px-3 py-2 text-sm text-zinc-500">No matching problems found.</p>
          )}

          {!isContextLoading && !isSearchLoading && !error && results.length > 0 && (
            <div className="space-y-2">
              <div className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                {matchType === 'exact' ? 'Exact match' : 'Top fuzzy matches'}
              </div>

              {results.map((problem) => (
                <ProblemMatchCard
                  key={problem.id}
                  problem={problem}
                  matchType={matchType === 'exact' ? 'exact' : 'fuzzy'}
                  onSelect={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};