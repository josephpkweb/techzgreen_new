import { useState, useCallback, createContext, useContext, useRef } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: number; msg: string; type: ToastType; }
interface ToastCtx { toast: (msg: string, type?: ToastType) => void; }

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

const icons = {
  success: <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />,
  error:   <XCircle     className="w-4 h-4 text-red-500   flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  info:    <Info        className="w-4 h-4 text-blue-500  flex-shrink-0" />,
};
const bg = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50   border-red-200   text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-blue-50  border-blue-100  text-blue-800',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((msg: string, type: ToastType = 'info') => {
    const id = ++counter.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90vw] max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold pointer-events-auto animate-fade-in-up ${bg[t.type]}`}
          >
            {icons[t.type]}
            <span className="flex-1 leading-snug">{t.msg}</span>
            <button onClick={() => dismiss(t.id)} className="p-0.5 opacity-50 hover:opacity-100 cursor-pointer flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
