export type ProblemSearchResult = {
  id: string;
  title: string;
  difficulty: string;
  similarityScore: number;
};

export type ProblemSearchResponse = {
  success: boolean;
  query: string;
  matchType: 'exact' | 'fuzzy';
  data: ProblemSearchResult[];
};