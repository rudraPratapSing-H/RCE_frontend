import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Workspace } from '../features/workspace/Workspace';

export const WorkspacePage: React.FC = () => {
  const { problemId } = useParams<{ problemId?: string }>();

  if (!problemId) {
    return (
      <div className="min-h-screen bg-gray-950 text-zinc-100">
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <p className="text-zinc-300">Open a problem via /workspace/:problemId to start coding.</p>
        </main>
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
