import React, { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { Dashboard, DashboardData } from '../components/dashboard/Dashboard';
import { Navbar } from '../features/navbar/Navbar';

const defaultDashboardData: DashboardData = {
  easy: 0,
  medium: 0,
  hard: 0,
  totalProblems: 0,
  acceptedProblems: 0,
  score: 0,
  submissions: []
};

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData>(defaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/dashboard/user-data');
        const payload = response.data?.data ?? response.data;

        if (isMounted) {
          setData({
            ...defaultDashboardData,
            ...payload,
            submissions: Array.isArray(payload?.submissions) ? payload.submissions : []
          });
          setError(null);
        }
      } catch (fetchError: any) {
        if (isMounted) {
          setError(fetchError?.response?.data?.message ?? fetchError.message ?? 'Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />
        <div className="flex items-center justify-center px-6 py-24">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm text-zinc-400 shadow-2xl">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />
        <div className="flex items-center justify-center p-6 py-24">
          <div className="w-full max-w-xl rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400 shadow-2xl">
            <h1 className="text-lg font-semibold">Dashboard unavailable</h1>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <Dashboard data={data} />
    </div>
  );
};
