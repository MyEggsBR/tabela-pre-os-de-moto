'use client';

import { useEffect, useState } from 'react';
import { Menu, Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Motorcycle = {
  id: string;
  brandModel: string;
  power: string;
  retailPrice: string;
  imageUrl1: string | null;
  imageUrl2: string | null;
};

export default function Inventory() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/motorcycles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMotorcycles(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="w-full top-0 sticky z-40 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Menu className="text-primary" />
          <h1 className="text-xl font-bold font-headline text-primary">Sourcing</h1>
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

      <main className="max-w-md mx-auto px-6 pt-8 pb-32">
        <div className="mb-10">
          <p className="text-on-surface-variant font-medium text-xs tracking-widest uppercase mb-2">Catálogo Operacional</p>
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface leading-tight">Inventário de <br/>Componentes</h2>
        </div>

        <div className="sticky top-20 z-30 mb-8">
          <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-xl p-2 flex items-center shadow-sm">
            <div className="flex-1 flex items-center px-3 gap-3">
              <Search className="text-outline" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por marca ou modelo..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full py-2 placeholder-on-surface-variant outline-none"
              />
            </div>
            <button className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-center text-primary">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-on-surface-variant">Carregando inventário...</div>
          ) : motorcycles.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant">Nenhum item cadastrado.</div>
          ) : (
            motorcycles.map((moto) => (
              <div key={moto.id} className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4 group hover:bg-surface-container-high transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-lowest relative">
                  {moto.imageUrl1 ? (
                    <Image src={moto.imageUrl1} alt={moto.brandModel} fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline-variant">
                      <Image src={`https://picsum.photos/seed/${moto.id}/100/100`} alt="Placeholder" fill className="object-cover opacity-50 grayscale" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-on-surface font-headline leading-tight">{moto.brandModel}</h4>
                    <span className="text-xs font-bold text-primary whitespace-nowrap ml-2">{moto.power || 'N/A'}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">R$ {moto.retailPrice || '0,00'}</p>
                </div>
                <ChevronRight className="text-outline group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
