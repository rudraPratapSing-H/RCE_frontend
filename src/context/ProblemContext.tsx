// ProblemContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the shape of our data
interface Problem {
  id: string;
  title: string;
  difficulty: string; // Optional difficulty field
}

interface ProblemContextType {
  problems: Problem[];
  isLoading: boolean;
}

// 2. Create the Context (outside the component)
export const ProblemContext = createContext<ProblemContextType>({
  problems: [],
  isLoading: true,
});

// 3. Create the Provider Component
export const ProblemProvider = ({ children }: { children: ReactNode }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data exactly once when the app mounts
    fetch('/api/problems/titles')
      .then(res => res.json())
      .then(data => {
        console.log ("Fetched problems:", data.data);
        setProblems(data.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch problems:", error);
        setIsLoading(false);
      });
  }, []);

  // Wrap the children in the Provider, passing down the state
  return (
    <ProblemContext.Provider value={{ problems, isLoading }}>
      {children}
    </ProblemContext.Provider>
  );
};