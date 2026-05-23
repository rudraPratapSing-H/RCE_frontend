import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../features/navbar/Navbar';
import { Workspace } from '../features/workspace/Workspace';
import ProblemExplorer from '../components/problems/ProblemExplorer';

export const WorkspacePage: React.FC = () => {
  const { problemId } = useParams<{ problemId?: string }>();

  if (!problemId) {
    return (
      <div className="min-h-screen bg-gray-950 text-zinc-100">
        <Navbar />
        <ProblemExplorer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-zinc-100">
      <Navbar />
      <Workspace />
    </div>
  );
};
