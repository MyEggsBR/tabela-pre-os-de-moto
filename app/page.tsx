'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle, Search, FileDown, FileSpreadsheet, Zap, RefreshCw } from 'lucide-react'
import { exportarPDF } from '@/lib/exportPDF'
import { exportarExcel } from '@/lib/exportExcel'

type Moto = {
  id: number; marca: string; modelo: string; potencia: string | null
  precoVarejo: number | null; precoAtacado: number | null; qtdMinimaAtacado: number | null
  autonomia: string | null; peso: string | null; cargaMaxima: string | null
  tempoRecarga: string | null; voltagem: string | null; observacoes: string | null
  fotoUrl1: string | null; fotoUrl2: string | null; criadoEm: string
}

function formatarMoeda(valor: number | null) {
  if (valor === null || valor === undefined) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function Dashboard() {
  const [motos, setMotos] = useState<Moto[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [exportandoPDF, setExportandoPDF] = useState(false)
  const [exportandoExcel, setExportandoExcel] = useState(false)

  const buscarMotos = useCallback(async () => {
    setCarregando(true)
    try {
      const params = busca ? `?busca=${encodeURIComponent(busca)}` : ''
      const res = await fetch(`/api/motos${params}`)
      if (!res.ok) throw new Error('Falha ao buscar')
      setMotos(await res.json())
    } catch (err) { console.error(err) } finally { setCarregando(false) }
  }, [busca])

  useEffect(() => { const t = setTimeout(() => buscarMotos(), 300); return () => clearTimeout(t) }, [buscarMotos])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-lg p-2"><Zap className="h-5 w-5 text-white" /></div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Trivolts Motors</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Curadoria de Motos Elétricas</p>
            </div>
          </div>
          <Link href="/adicionar">
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar Moto</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total de Motos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{motos.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Marcas</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{new Set(motos.map(m => m.marca)).size}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-500">Com Fotos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{motos.filter(m => m.fotoUrl1).length}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar por marca ou modelo..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9 bg-white" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={async () => { setExportandoExcel(true); try { await exportarExcel(motos) } finally { setExportandoExcel(false) } }} disabled={exportandoExcel || motos.length === 0}>
              <FileSpreadsheet className="h-4 w-4 text-green-700" />{exportandoExcel ? 'Gerando...' : 'Excel'}
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={async () => { setExportandoPDF(true); try { await exportarPDF(motos) } finally { setExportandoPDF(false) } }} disabled={exportandoPDF || motos.length === 0}>
              <FileDown className="h-4 w-4 text-red-600" />{exportandoPDF ? 'Gerando...' : 'PDF'}
            </Button>
            <Button variant="ghost" size="icon" onClick={buscarMotos}><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="sm:hidden divide-y divide-gray-100">
            {carregando ? Array.from({length:4}).map((_,i) => (
              <div key={i} className="p-4 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>
            )) : motos.length === 0 ? (
              <div className="p-10 text-center text-gray-500"><p className="font-medium">Nenhuma moto encontrada</p><p className="text-sm mt-1">Adicione sua primeira moto usando o botão acima.</p></div>
            ) : motos.map(moto => (
              <div key={moto.id} className="p-4 flex gap-3">
                {moto.fotoUrl1 ? (
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image src={moto.fotoUrl1} alt={`${moto.marca} ${moto.modelo}`} fill className="object-cover" unoptimized />
                  </div>
                ) : <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Zap className="h-6 w-6 text-gray-300" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{moto.marca} {moto.modelo}</p>
                  {moto.potencia && <Badge variant="secondary" className="text-xs mt-1">{moto.potencia}</Badge>}
                  <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <div><p className="text-gray-400 text-xs">Varejo</p><p className="font-medium text-gray-800">{formatarMoeda(moto.precoVarejo)}</p></div>
                    <div><p className="text-gray-400 text-xs">Atacado</p><p className="font-medium text-gray-800">{formatarMoeda(moto.precoAtacado)}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Marca / Modelo</TableHead>
                  <TableHead>Potência</TableHead>
                  <TableHead>Preço Varejo</TableHead>
                  <TableHead>Preço Atacado</TableHead>
                  <TableHead>Qtd. Mín. Atacado</TableHead>
                  <TableHead>Autonomia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? Array.from({length:5}).map((_,i) => (
                  <TableRow key={i}>{Array.from({length:7}).map((_,j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                )) : motos.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-16 text-gray-500"><p className="font-medium">Nenhuma moto cadastrada</p></TableCell></TableRow>
                ) : motos.map(moto => (
                  <TableRow key={moto.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      {moto.fotoUrl1 ? (
                        <div className="relative h-14 w-14 rounded-md overflow-hidden border border-gray-200">
                          <Image src={moto.fotoUrl1} alt={`${moto.marca} ${moto.modelo}`} fill className="object-cover" unoptimized />
                        </div>
                      ) : <div className="h-14 w-14 rounded-md bg-gray-100 flex items-center justify-center"><Zap className="h-5 w-5 text-gray-300" /></div>}
                    </TableCell>
                    <TableCell><div><p className="font-semibold text-gray-900">{moto.marca}</p><p className="text-sm text-gray-500">{moto.modelo}</p></div></TableCell>
                    <TableCell>{moto.potencia ? <Badge variant="secondary">{moto.potencia}</Badge> : <span className="text-gray-400">—</span>}</TableCell>
                    <TableCell className="font-medium">{formatarMoeda(moto.precoVarejo)}</TableCell>
                    <TableCell className="font-medium text-green-700">{formatarMoeda(moto.precoAtacado)}</TableCell>
                    <TableCell>{moto.qtdMinimaAtacado ? `${moto.qtdMinimaAtacado} un.` : <span className="text-gray-400">—</span>}</TableCell>
                    <TableCell>{moto.autonomia || <span className="text-gray-400">—</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 pb-4">Trivolts Motors · Uso interno · {new Date().getFullYear()}</p>
      </div>
    </main>
  )
}