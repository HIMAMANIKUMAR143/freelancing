import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          {t.type === 'success' ? (
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          ) : t.type === 'error' ? (
            <AlertCircle size={18} color="var(--accent-rose)" />
          ) : (
            <Info size={18} color="var(--accent-blue)" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
