import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, CheckCircle2, ChevronRight, CircleAlert, Trophy } from 'lucide-react';

export interface DashboardSubmission {
  id: string;
  problemId: string;
  language: string;
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  createdAt: string;
}

export interface DashboardData {
  easy: number;
  medium: number;
  hard: number;
  totalProblems: number;
  acceptedProblems: number;
  score: number;
  submissions: DashboardSubmission[];
}

interface DashboardProps {
  data: DashboardData;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
};

const isAcceptedStatus = (status: string) => status.trim().toLowerCase() === 'accepted';

const formatTestCases = (passed: number, total: number) => {
  if (typeof passed !== 'number' || typeof total !== 'number') {
    return '—';
  }

  return `${passed}/${total}`;
};

const StatCard = ({
  label,
  value,
  icon,
  helper
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  helper?: React.ReactNode;
}) => (
  <section className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-zinc-500 text-sm font-semibold">{label}</p>
        <div className="mt-2 text-3xl font-semibold text-zinc-100">{value}</div>
        {helper ? <div className="mt-2 text-sm text-zinc-400">{helper}</div> : null}
      </div>
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.14)]">
        {icon}
      </div>
    </div>
  </section>
);

const difficultyStyles = {
  easy: 'rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1 text-green-400',
  medium: 'rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-orange-400',
  hard: 'rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-red-400'
} as const;

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Total Score"
            value={data.score.toFixed(2)}
            icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
            helper="Weighted performance score"
          />

          <StatCard
            label="Problems Solved"
            value={`${data.acceptedProblems}/${data.totalProblems}`}
            icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
            helper="Accepted submissions across the problem set"
          />

          <StatCard
            label="Difficulty Breakdown"
            value={
              <div className="flex flex-wrap items-center gap-3 text-base font-semibold text-zinc-100">
                <span className={difficultyStyles.easy}>Easy {data.easy}</span>
                <span className={difficultyStyles.medium}>Medium {data.medium}</span>
                <span className={difficultyStyles.hard}>Hard {data.hard}</span>
              </div>
            }
            icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
            helper="Solved by difficulty tier"
          />
        </section>

        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="border-b border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">Submission History</h2>
            <p className="mt-1 text-sm text-zinc-500">Recent runs and their evaluation results</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead>
                <tr>
                  <th className="border-b border-zinc-800 p-4 text-left text-sm font-semibold text-zinc-500">Date</th>
                  <th className="border-b border-zinc-800 p-4 text-left text-sm font-semibold text-zinc-500">Problem</th>
                  <th className="border-b border-zinc-800 p-4 text-left text-sm font-semibold text-zinc-500">Language</th>
                  <th className="border-b border-zinc-800 p-4 text-left text-sm font-semibold text-zinc-500">Status</th>
                  <th className="border-b border-zinc-800 p-4 text-left text-sm font-semibold text-zinc-500">Test Cases</th>
                </tr>
              </thead>
              <tbody>
                {data.submissions.length > 0 ? (
                  data.submissions.map((submission) => {
                    const accepted = isAcceptedStatus(submission.status);

                    return (
                      <tr
                        key={submission.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open problem ${submission.problemId}`}
                        onClick={() => navigate(`/workspace/${submission.problemId}`)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            navigate(`/workspace/${submission.problemId}`);
                          }
                        }}
                        className="cursor-pointer transition-all duration-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      >
                        <td className="p-4 text-sm text-zinc-300">{formatDate(submission.createdAt)}</td>
                        <td className="p-4 text-sm text-blue-500">{submission.problemId}</td>
                        <td className="p-4 text-sm text-zinc-300">{submission.language}</td>
                        <td className="p-4 text-sm">
                          <span
                            className={accepted
                              ? 'inline-flex items-center rounded-lg border border-green-500/20 bg-green-500/10 px-2 py-1 text-green-400'
                              : 'inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-red-400'}
                          >
                            {accepted ? (
                              <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden="true" />
                            ) : (
                              <CircleAlert className="mr-1 h-4 w-4" aria-hidden="true" />
                            )}
                            {submission.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-zinc-300">
                          {formatTestCases(submission.testCasesPassed, submission.totalTestCases)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm text-zinc-500">
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-zinc-800 p-4 text-sm text-zinc-500">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            Select a submission to open the workspace.
          </div>
        </section>
      </div>
    </main>
  );
};
