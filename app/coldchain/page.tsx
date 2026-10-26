'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip, type ChartData, type ChartOptions } from 'chart.js';
import { useApp } from '@/app/providers';
import { WHATSAPP_RECIPIENT, type Freezer } from '@/data/types';
import { FreezerDot, PageHeader, PageShell, StatusPill } from '@/components/ui';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Reading = { label: string; value: number };

const makeHistory = (temp: number): Reading[] => Array.from({ length: 14 }, (_, index) => ({ label: `${index * 3}s`, value: Number((temp + (Math.random() - 0.5) * 1.3).toFixed(1)) }));
const prettyTemp = (temp: number) => `${temp > 0 ? '+' : ''}${Number.isInteger(temp) ? temp : temp.toFixed(1)}°C`;
const whatsappUrl = (freezer: Freezer, affectedCount: number) => {
  const message = `CRITICAL: ${freezer.name} at ${prettyTemp(freezer.currentTemp)}! ${affectedCount} reagents at risk. Please coordinate an emergency swap immediately.`;
  return `https://wa.me/${WHATSAPP_RECIPIENT.replace('+', '')}?text=${encodeURIComponent(message)}`;
};

export default function ColdChainPage() {
  const { freezers, reagents, alerts, labs, updateFreezerTemp, simulatePowerFailure, emergencyInfo } = useApp();
  const [selectedId, setSelectedId] = useState('freezer-1');
  const selected = freezers.find((item) => item.id === selectedId) ?? freezers[0];
  const [history, setHistory] = useState<Reading[]>(() => makeHistory(selected?.currentTemp ?? -20));
  const selectedRef = useRef<Freezer | undefined>(selected);
  const updateRef = useRef(updateFreezerTemp);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { updateRef.current = updateFreezerTemp; }, [updateFreezerTemp]);

  useEffect(() => {
    setHistory(makeHistory(selected?.currentTemp ?? -20));
    const timer = window.setInterval(() => {
      const current = selectedRef.current;
      if (!current) return;
      const drift = current.targetTemp === 4 ? (Math.random() - 0.44) * 1.2 : (Math.random() - 0.5) * 1.8;
      const next = Number((current.currentTemp + drift).toFixed(1));
      setHistory((items) => [...items.slice(-19), { label: 'now', value: next }]);
      updateRef.current(current.id, next);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [selectedId]);

  const chartData: ChartData<'line'> = useMemo(() => ({
    labels: history.map((item) => item.label),
    datasets: [{ label: 'Temperature', data: history.map((item) => item.value), borderColor: '#10a89f', backgroundColor: 'rgba(16, 168, 159, 0.12)', fill: true, tension: 0.42, pointRadius: 0, pointHoverRadius: 4, borderWidth: 3 }],
  }), [history]);
  const chartOptions: ChartOptions<'line'> = useMemo(() => ({ responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, plugins: { legend: { display: false }, tooltip: { displayColors: false, backgroundColor: '#102226', padding: 12, titleFont: { size: 11 }, bodyFont: { size: 13, weight: 'bold' }, callbacks: { label: (context) => ` ${context.parsed.y}°C` } } }, scales: { x: { display: false }, y: { grid: { color: 'rgba(16,34,38,0.08)' }, ticks: { color: '#6f8182', font: { size: 10 }, callback: (value) => `${value}°` } } } }), []);

  if (!selected) return <PageShell><p className="text-ink/60">Loading cold-chain network…</p></PageShell>;
  const affectedCount = reagents.filter((item) => selected.reagentsInside.includes(item.id)).length;
  const selectedLab = labs.find((lab) => lab.id === selected.labId);
  const openWhatsAppAlert = () => {
    simulatePowerFailure(selected.id);
    window.open(whatsappUrl({ ...selected, currentTemp: 0 }, affectedCount), '_blank', 'noopener,noreferrer');
  };

  return <PageShell><PageHeader eyebrow="Simulated telemetry" title="Cold-chain monitor" description="Watch freezer health in real time. Every reading below is simulated in-browser, so you can safely test the response path before a real incident happens." actions={<div className="flex items-center gap-2 rounded-full border border-teal-700/15 bg-teal-50 px-4 py-3 text-xs font-black text-teal-800"><span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" /> Live simulation · every 3s</div>} />
    <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
      <div className="space-y-4"><div className="panel rounded-2xl bg-white/80 p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-black">Your freezers</p><p className="mt-1 text-xs text-ink/45">Select a node to inspect</p></div><span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-black text-ink/45">{freezers.length} nodes</span></div><div className="space-y-2">{freezers.map((freezer) => <button type="button" key={freezer.id} onClick={() => setSelectedId(freezer.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === freezer.id ? 'bg-ink text-white shadow-soft' : 'hover:bg-sand'}`}><FreezerDot status={freezer.status} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-black">{freezer.name}</span><span className={`mt-1 block text-xs ${selectedId === freezer.id ? 'text-white/50' : 'text-ink/45'}`}>Target {freezer.targetTemp}°C · {freezer.reagentsInside.length} reagents</span></span><span className={`text-right font-display text-lg font-black ${selectedId === freezer.id ? 'text-teal-300' : ''}`}>{prettyTemp(freezer.currentTemp)}</span></button>)}</div></div><div className="rounded-2xl border border-red-200 bg-red-50 p-5"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-100 text-red-700">!</span><div><p className="text-xs font-black uppercase tracking-[0.1em] text-red-700">Test the response path</p><p className="mt-2 text-sm leading-6 text-red-900/70">Force {selected.name} to 0°C and automatically mark {affectedCount} reagents as emergency swap.</p></div></div><button type="button" onClick={openWhatsAppAlert} className="mt-4 w-full rounded-xl bg-[#16a34a] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-[#128c3f]">Simulate failure + open WhatsApp</button><p className="mt-3 text-center text-[11px] font-bold text-red-900/55">Prefilled alert → {WHATSAPP_RECIPIENT}</p></div></div>
      <div className="space-y-5"><div className="panel rounded-2xl bg-white/80 p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-3"><h2 className="font-display text-2xl font-black tracking-tight">{selected.name}</h2><StatusPill status={selected.status} /></div><p className="mt-2 text-sm text-ink/45">{selectedLab?.university} · {selectedLab?.state} · target {selected.targetTemp}°C</p></div><div className="text-left sm:text-right"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-ink/40">Current reading</p><p className={`mt-1 font-display text-4xl font-black tracking-tight ${selected.status === 'Critical' ? 'text-red-600' : selected.status === 'Warning' ? 'text-amber-600' : 'text-teal-700'}`}>{prettyTemp(selected.currentTemp)}</p></div></div><div className="mt-8 h-[280px] w-full"><Line data={chartData} options={chartOptions} /></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-4 text-xs"><span className="font-bold text-ink/45">Last 42 seconds · browser simulation</span><span className="font-black text-ink/65">Safe band: {selected.targetTemp === 4 ? '1°C to 6°C' : `below ${selected.targetTemp === -20 ? '-18' : '-75'}°C`}</span></div></div><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-ink/10 bg-white/70 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-ink/40">Reagents inside</p><p className="mt-2 font-display text-2xl font-black">{affectedCount}</p><p className="mt-1 text-xs text-ink/45">Protected inventory</p></div><div className="rounded-2xl border border-ink/10 bg-white/70 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-ink/40">Alerts generated</p><p className="mt-2 font-display text-2xl font-black">{alerts.filter((alert) => alert.freezerId === selected.id).length}</p><p className="mt-1 text-xs text-ink/45">Simulated messages</p></div><div className="rounded-2xl border border-ink/10 bg-white/70 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-ink/40">Response state</p><p className="mt-2 font-display text-2xl font-black">{selected.status === 'Critical' ? 'Rescue' : 'Watching'}</p><p className="mt-1 text-xs text-ink/45">{emergencyInfo?.university ?? 'No active incident'}</p></div></div></div>
    </div>
  </PageShell>;
}
