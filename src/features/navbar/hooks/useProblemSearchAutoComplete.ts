// src/hooks/useProblemSearch.ts
import { useState, useEffect } from 'react';
import { globalTries } from '../utils/AutocompleteTrie.util'; // Import the global Trie instance

interface ProblemResult {
  id: string;
  title: string;
  difficulty?: string; // Optional difficulty field
}

// Now it takes the problems array from your Context as a second argument
export const useProblemSearch = (query: string, problems: ProblemResult[]) => {
  const [results, setResults] = useState<ProblemResult[]>([]);
  const [matchType, setMatchType] = useState<'exact' | 'fuzzy' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Populate Trie from Context ---
  useEffect(() => {
    console.log('[Trie] problems:', problems);
    // Only populate if the Trie is empty (root has no children) and problems exist
    if (problems.length > 0 && (globalTries as any).root?.children?.size === 0) {
      
      console.log('[Trie] Populating trie with problems:', problems.length);
      globalTries.clear();
      problems.forEach(p => {
        (globalTries as any).insert(p.title, p.id, p.difficulty); // Insert difficulty into the Trie
        console.log(`[Trie] Inserted: ${p.title} (${p.id}) and difficulty: ${p.difficulty}`); // Debug: Log each insertion with difficulty
      });
      console.log('[Trie] Trie population complete. Root children:', (globalTries as any).root?.children?.size);
      globalTries.printTree(); // Debug: Print the trie structure after population
    } else {
      console.log('[Trie] Trie already populated or no problems to insert. Root children:', (globalTries as any).root?.children?.size, 'Problems:', problems.length);
    }
  }, [problems]);

  // --- EXISTING SEARCH LOGIC ---
  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      setResults([]);
      setMatchType(null);
      setIsLoading(false);
      console.log('[Search] Query is empty. Skipping search.');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('[Search] Searching for:', normalizedQuery);

    const debounceTimer = setTimeout(() => {
      try {
        const matches = globalTries.getSuggestions(normalizedQuery, 5);
        setResults(matches);
        console.log(`[Search] Found ${matches.length} matches for query: '${normalizedQuery}'`, matches);

        if (matches.length > 0) {
          const isExact = matches[0].title.toLowerCase() === normalizedQuery;
          setMatchType(isExact ? 'exact' : 'fuzzy');
          console.log(`[Search] Match type: ${isExact ? 'exact' : 'fuzzy'}`);
        } else {
          setMatchType(null);
          console.log('[Search] No matches found.');
        }
      } catch (err) {
        console.error("[Search] Search failed:", err);
        setError("Failed to retrieve search results.");
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, matchType, isLoading, error };
};

