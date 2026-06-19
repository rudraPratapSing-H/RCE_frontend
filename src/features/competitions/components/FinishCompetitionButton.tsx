import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { finishCompetition } from '../api/finishCompetition';

interface FinishCompetitionButtonProps {
  competitionId: string;
  disabled?: boolean;
  onFinishSuccess?: () => void;
}

export const FinishCompetitionButton: React.FC<FinishCompetitionButtonProps> = ({ 
  competitionId, 
  disabled = false,
  onFinishSuccess
}) => {
  const [finishing, setFinishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleFinishCompetition = async () => {
    try {
      setFinishing(true);
      await finishCompetition(competitionId);
      setShowConfirmModal(false);
      if (onFinishSuccess) {
        onFinishSuccess();
      } else {
        navigate('/workspace');
      }
    } catch (err) {
      console.error('Error finishing competition:', err);
      alert('Failed to finish competition.');
    } finally {
      setFinishing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        disabled={disabled || finishing}
        className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {finishing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        Finish Competition
      </button>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Finish Competition?</h3>
            <p className="text-zinc-400 mb-6">Are you sure you want to finish? You will not be able to submit further answers.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={finishing}
                className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishCompetition}
                disabled={finishing}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Confirm Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
