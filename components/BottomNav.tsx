'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/add' || pathname.startsWith('/edit')) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
      <Link href="/" className={`flex flex-col items-center justify-center transition-transform duration-200 ${pathname === '/' ? 'text-primary bg-surface-container-low rounded-xl px-8 py-2 scale-95' : 'text-outline hover:text-primary px-8 py-2'}`}>
        <LayoutDashboard size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
        <span className="text-[11px] font-semibold font-body mt-1">Início</span>
      </Link>
      <Link href="/inventory" className={`flex flex-col items-center justify-center transition-transform duration-200 ${pathname === '/inventory' ? 'text-primary bg-surface-container-low rounded-xl px-8 py-2 scale-95' : 'text-outline hover:text-primary px-8 py-2'}`}>
        <Package size={24} strokeWidth={pathname === '/inventory' ? 2.5 : 2} />
        <span className="text-[11px] font-semibold font-body mt-1">Estoque</span>
      </Link>
    </nav>
  );
}
