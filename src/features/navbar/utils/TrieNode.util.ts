// TrieNode.ts
export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  problemId?: string;
  difficulty?: string; // Add difficulty field to TrieNode

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}