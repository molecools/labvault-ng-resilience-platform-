import type { FreezerStatus, ReagentStatus } from '@/data/types';

export function PageShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 pb-20 pt-10 lg:px-10 lg:pt-14 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
    <div className="max-w-2xl">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="font-display text-4xl font-black tracking-[-0.04em] text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink/55">{description}</p>
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>;
}

export function StatusPill({ status }: { status: ReagentStatus | FreezerStatus }) {
  const critical = status === 'At-Risk' || status === 'AT RISK - EMERGENCY SWAP' || status === 'Critical';
  const warning = status === 'Warning' || status === 'Reserved';
  return <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${critical ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200' : warning ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' : 'bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200'}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${critical ? 'bg-red-500' : warning ? 'bg-amber-500' : 'bg-teal-500'}`} />
    {status}
  </span>;
}

export function FreezerDot({ status }: { status: FreezerStatus }) {
  return <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status === 'Critical' ? 'bg-red-100 text-red-700' : status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'}`}>
    <span className={`h-3 w-3 rounded-full ${status === 'Critical' ? 'bg-red-500' : status === 'Warning' ? 'bg-amber-500' : 'bg-teal-500'}`} />
  </span>;
}

export const formatNGN = (value: number) => `₦${new Intl.NumberFormat('en-NG').format(value)}`;
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
export const formatTime = (value: string) => new Intl.DateTimeFormat('en-NG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function MiniSpark({ color = '#10a89f', points = '0,25 12,22 25,28 37,12 50,17 64,7 80,10' }: { color?: string; points?: string }) {
  return <svg viewBox="0 0 80 32" className="h-8 w-20 overflow-visible" aria-hidden="true"><polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} /></svg>;
}
