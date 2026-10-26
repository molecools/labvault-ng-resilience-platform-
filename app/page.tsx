import Link from 'next/link';
import { MiniSpark, PageShell } from '@/components/ui';

const stats = [
  { value: '120', label: 'Reagents saved', delta: '+18 this month', color: '#10a89f' },
  { value: '15', label: 'Labs connected', delta: 'Across 7 states', color: '#fb775f' },
  { value: '₦8.4m', label: 'Value recirculated', delta: 'Instead of expiring', color: '#8c7cf1' },
];

const networkRows = [
  ['OAU', 'Osun', '5 emergency swaps ready', 'Critical'],
  ['FUTA', 'Ondo', '18 reagents shared', 'Stable'],
  ['UNILAG', 'Lagos', 'Cold room online', 'Stable'],
];

export default function HomePage() {
  return <PageShell className="grid-paper min-h-[calc(100vh-80px)]">
    <section className="grid items-center gap-12 pb-16 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-24 lg:pt-8">
      <div>
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-700/15 bg-white/75 px-3 py-2 text-xs font-black uppercase tracking-[0.13em] text-teal-800 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-coral" /> Nigeria&apos;s lab resilience network
        </div>
        <h1 className="max-w-3xl font-display text-[clamp(3.4rem,7vw,7.5rem)] font-black leading-[0.88] tracking-[-0.08em] text-ink">Keep science moving<span className="text-teal-600">.</span></h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-ink/60 sm:text-xl">LabVault NG turns surplus reagents and cold-chain signals into a shared safety net for Nigerian labs — before value becomes waste.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/marketplace" className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 text-sm font-black text-sand shadow-soft transition hover:-translate-y-1 hover:bg-teal-700">Explore the marketplace <span className="transition group-hover:translate-x-1">↗</span></Link>
          <Link href="/coldchain" className="inline-flex items-center justify-center gap-3 rounded-full border border-ink/15 bg-white/80 px-6 py-4 text-sm font-black text-ink transition hover:-translate-y-1 hover:border-teal-500 hover:text-teal-800">Open cold-chain monitor <span>◌</span></Link>
        </div>
        <Link href="/inventory" className="mt-5 inline-block text-xs font-bold text-ink/45 underline decoration-teal-500/50 underline-offset-4 hover:text-teal-800">Enter as Demo Lab - FUTA →</Link>
      </div>

      <div className="relative">
        <div className="absolute -right-4 -top-5 h-28 w-28 rounded-full bg-teal-300/40 blur-2xl" />
        <div className="panel relative overflow-hidden rounded-[2rem] bg-ink p-6 text-sand shadow-glow sm:p-8">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full border border-teal-300/20" />
          <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-teal-300/15" />
          <div className="relative flex items-start justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.16em] text-teal-300">Network pulse</p><p className="mt-2 text-sm text-sand/55">Live simulated activity</p></div>
            <div className="flex items-center gap-2 rounded-full bg-teal-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-teal-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" /> Online</div>
          </div>
          <div className="relative mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-3xl font-black tracking-tight">98.7%</p><p className="mt-1 text-xs text-sand/45">Cold-chain uptime</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-3xl font-black tracking-tight">₦2.1m</p><p className="mt-1 text-xs text-sand/45">At-risk value watched</p></div>
          </div>
          <div className="relative mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-sand/55">Temperature stability · Freezer A</span><span className="text-xs font-black text-teal-300">-20.1°C</span></div>
            <div className="mt-5 h-20 w-full"><svg viewBox="0 0 360 80" className="h-full w-full" preserveAspectRatio="none"><defs><linearGradient id="pulse" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#25c6bb" stopOpacity="0.42"/><stop offset="1" stopColor="#25c6bb" stopOpacity="0"/></linearGradient></defs><path d="M0 52 C18 51 24 45 39 49 S64 57 78 48 S104 28 119 39 S147 55 162 42 S188 24 204 35 S226 48 242 41 S267 31 281 38 S305 48 321 29 S343 23 360 26 V80 H0 Z" fill="url(#pulse)"/><path d="M0 52 C18 51 24 45 39 49 S64 57 78 48 S104 28 119 39 S147 55 162 42 S188 24 204 35 S226 48 242 41 S267 31 281 38 S305 48 321 29 S343 23 360 26" fill="none" stroke="#5de2d3" strokeWidth="3" strokeLinecap="round"/></svg></div>
          </div>
          <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-sand/45">Last sync · just now</span><Link href="/coldchain" className="text-xs font-black text-teal-300 hover:text-white">View monitor →</Link></div>
        </div>
      </div>
    </section>

    <section className="grid gap-4 border-y border-ink/10 py-5 md:grid-cols-3">
      {stats.map((stat) => <div key={stat.label} className="flex items-center justify-between gap-4 px-2 py-2 md:px-4"><div><p className="font-display text-3xl font-black tracking-tight text-ink">{stat.value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.11em] text-ink/45">{stat.label}</p></div><div className="text-right"><MiniSpark color={stat.color} /><p className="text-[10px] font-bold text-ink/40">{stat.delta}</p></div></div>)}
    </section>

    <section className="grid gap-10 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:py-28">
      <div><p className="eyebrow mb-3">A better lab economy</p><h2 className="max-w-md font-display text-4xl font-black leading-[0.96] tracking-[-0.05em] sm:text-5xl">Waste less. Respond sooner. Share more.</h2><p className="mt-5 max-w-md text-base leading-7 text-ink/55">Research teams lose time and budget when supplies expire in isolation or freezers fail without a response path. LabVault makes the next move visible.</p><Link href="/marketplace" className="mt-7 inline-flex rounded-full bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-ink">See what&apos;s available →</Link></div>
      <div className="panel overflow-hidden rounded-[1.6rem] bg-white/75"><div className="flex items-center justify-between border-b border-ink/10 px-5 py-4"><div><p className="text-sm font-black">Network watchlist</p><p className="mt-1 text-xs text-ink/45">A snapshot of connected labs</p></div><span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-teal-800">3 live nodes</span></div><div className="divide-y divide-ink/8">{networkRows.map(([lab, state, note, status]) => <div key={lab} className="grid grid-cols-[0.3fr_0.35fr_1fr_auto] items-center gap-3 px-5 py-5 text-sm"><span className="font-black">{lab}</span><span className="text-ink/45">{state}</span><span className="text-ink/60">{note}</span><span className={`justify-self-end rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${status === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-teal-800'}`}>{status}</span></div>)}</div></div>
    </section>

    <section className="relative overflow-hidden rounded-[2rem] bg-teal-700 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:py-14"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/15" /><div className="absolute -right-4 -top-4 h-32 w-32 rounded-full border border-white/15" /><div className="relative"><p className="eyebrow text-teal-100">The first response layer</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl">When the cold chain moves, your network should move with it.</h2></div><Link href="/coldchain" className="relative mt-7 inline-flex shrink-0 rounded-full bg-white px-5 py-3 text-sm font-black text-teal-800 transition hover:bg-ink hover:text-white lg:mt-0">Monitor your freezers →</Link></section>
  </PageShell>;
}
