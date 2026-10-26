'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/app/providers';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/inventory', label: 'My Inventory' },
  { href: '/coldchain', label: 'Cold Chain' },
  { href: '/alerts', label: 'Alert Log' },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { alerts } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-sand/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-ink text-sand shadow-soft">
            <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-teal-400/80" />
            <span className="relative text-sm font-black tracking-tight">LV</span>
          </span>
          <span>
            <span className="block font-display text-lg font-black leading-none tracking-tight">LabVault <span className="text-teal-600">NG</span></span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-ink/45">Lab resilience network</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {links.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${active ? 'bg-ink text-sand' : 'text-ink/55 hover:bg-white hover:text-ink'}`}>{link.label}</Link>;
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="hidden items-center gap-2 rounded-full border border-teal-600/15 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
            Network live · {alerts.length} alerts
          </div>
          <Link href="/inventory" className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-xs font-black text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">Demo Lab · FUTA</Link>
        </div>

        <button type="button" aria-label="Toggle navigation" className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-white xl:hidden" onClick={() => setOpen((value) => !value)}>
          <span className="text-lg">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && <nav className="border-t border-ink/10 bg-sand px-5 py-3 xl:hidden" aria-label="Mobile navigation">
        <div className="mx-auto grid max-w-[1440px] gap-1">
          {links.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold ${active ? 'bg-ink text-sand' : 'text-ink/65 hover:bg-white'}`}>{link.label}</Link>;
          })}
          <Link href="/inventory" onClick={() => setOpen(false)} className="mt-2 rounded-xl border border-teal-700/20 bg-teal-50 px-4 py-3 text-sm font-black text-teal-800">Enter as Demo Lab - FUTA</Link>
        </div>
      </nav>}
    </header>
  );
}
