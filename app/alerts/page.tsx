'use client';

import { useMemo } from 'react';
import { useApp } from '@/app/providers';
import { PageHeader, PageShell, formatTime } from '@/components/ui';

const icon: Record<string, string> = { Dashboard: '◈', SMS: '▣', WhatsApp: '◌' };
const tone: Record<string, string> = { Dashboard: 'bg-teal-50 text-teal-800', SMS: 'bg-blue-50 text-blue-700', WhatsApp: 'bg-emerald-50 text-emerald-700' };

export default function AlertsPage() {
  const { alerts, freezers } = useApp();
  const counts = useMemo(() => ({ dashboard: alerts.filter((alert) => alert.type === 'Dashboard').length, sms: alerts.filter((alert) => alert.type === 'SMS').length, whatsapp: alerts.filter((alert) => alert.type === 'WhatsApp').length }), [alerts]);
  return <PageShell><PageHeader eyebrow="Simulated communications" title="Alert log" description="A transparent record of what the network would send when a freezer crosses its safe threshold. No Twilio, no paid API, just a reliable demo path." actions={<div className="rounded-full border border-ink/10 bg-white px-4 py-3 text-xs font-black text-ink/60">{alerts.length} total events</div>} />
    <div className="mb-7 grid gap-4 sm:grid-cols-3"><Metric label="Dashboard" value={String(counts.dashboard).padStart(2, '0')} detail="Internal incident log" color="teal" /><Metric label="SMS simulation" value={String(counts.sms).padStart(2, '0')} detail="Ops team notification" color="blue" /><Metric label="WhatsApp simulation" value={String(counts.whatsapp).padStart(2, '0')} detail="Partner lab broadcast" color="green" /></div>
    <div className="panel overflow-hidden rounded-2xl bg-white/80"><div className="border-b border-ink/10 px-5 py-4"><p className="text-sm font-black">Network event stream</p><p className="mt-1 text-xs text-ink/45">Newest events appear first · trigger one from Cold Chain Monitor</p></div>{alerts.length === 0 ? <div className="px-6 py-20 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sand text-2xl text-ink/45">◌</div><p className="mt-5 font-display text-2xl font-black">No alerts yet</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink/50">When a freezer goes critical, LabVault will create Dashboard, SMS, and WhatsApp simulation entries here automatically.</p></div> : <div className="divide-y divide-ink/8">{alerts.map((alert) => { const freezer = freezers.find((item) => item.id === alert.freezerId); return <div key={alert.id} className="flex items-start gap-4 px-5 py-5 sm:px-6"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg ${tone[alert.type]}`}>{icon[alert.type]}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-ink/55">{alert.type} simulation</span><span className="text-xs font-bold text-ink/35">{formatTime(alert.timestamp)}</span></div><p className="mt-2 text-sm font-bold leading-6 text-ink/75">{alert.message}</p><p className="mt-1 text-xs text-ink/40">Source · {freezer?.name ?? 'Unknown freezer'} · reading {alert.temp}°C</p></div></div>; })}</div>}</div>
  </PageShell>;
}

function Metric({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) { return <div className="rounded-2xl border border-ink/10 bg-white/75 p-5"><div className={`mb-4 h-1.5 w-10 rounded-full ${color === 'teal' ? 'bg-teal-500' : color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} /><p className="text-[10px] font-black uppercase tracking-[0.12em] text-ink/40">{label}</p><p className="mt-2 font-display text-3xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs font-medium text-ink/45">{detail}</p></div>; }
