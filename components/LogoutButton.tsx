'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao sair', error);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="flex items-center gap-2 text-sm font-bold text-error hover:bg-error/10 px-3 py-2 rounded-lg transition-colors"
      title="Sair"
    >
      <LogOut size={20} />
      <span className="hidden sm:inline">Sair</span>
    </button>
  );
}
