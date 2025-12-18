
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  messages: ToastMessage[];
  removeToast: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ messages, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {messages.map((m) => (
        <ToastItem key={m.id} message={m} onRemove={() => removeToast(m.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ message: ToastMessage; onRemove: () => void }> = ({ message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div className="pointer-events-auto flex items-center gap-3 bg-white border border-zinc-200 px-4 py-3 rounded-xl shadow-xl min-w-[300px] animate-in slide-in-from-right-10 duration-300">
      {message.type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-black" />
      ) : (
        <AlertCircle className="w-5 h-5 text-zinc-400" />
      )}
      <span className="text-sm font-bold text-zinc-900 flex-1">{message.text}</span>
      <button onClick={onRemove} className="text-zinc-400 hover:text-black transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
