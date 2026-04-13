import Link from 'next/link';
import { Menu, Plus, Package } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <>
      <header className="w-full top-0 sticky bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md flex justify-between items-center px-6 py-4 z-40">
        <div className="flex items-center gap-4">
          <Menu className="text-primary" />
          <h1 className="text-2xl font-extrabold font-headline tracking-tighter text-primary">Sourcing</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden ring-2 ring-primary/10 relative">
          <Image 
            src="https://picsum.photos/seed/user/100/100" 
            alt="Perfil" 
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-12 max-w-2xl mx-auto w-full gap-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Painel Geral</span>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface leading-tight">Gestão de <br />Suprimentos</h2>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <Link href="/add" className="aspect-square w-full bg-surface-container-lowest rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-200 active:scale-95 border border-transparent hover:border-primary-container group relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
              <Plus size={40} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold font-headline text-on-surface">Adicionar Moto</p>
              <p className="text-sm font-body text-on-surface-variant mt-1">Cadastrar novo item no sistema</p>
            </div>
          </Link>

          <Link href="/inventory" className="aspect-square w-full bg-surface-container-lowest rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-200 active:scale-95 border border-transparent hover:border-primary-container group relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface mb-2 group-hover:scale-110 transition-transform">
              <Package size={40} strokeWidth={2} />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold font-headline text-on-surface">Tabela de Estoque</p>
              <p className="text-sm font-body text-on-surface-variant mt-1">Visualizar e gerenciar inventário</p>
            </div>
          </Link>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between mt-4">
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Status do Mês</p>
            <p className="text-lg font-bold font-headline text-on-surface">12 Novas Cotações</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-slate-300"></div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-slate-400"></div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary text-[10px] flex items-center justify-center text-white font-bold">+4</div>
          </div>
        </div>
      </main>
    </>
  );
}
