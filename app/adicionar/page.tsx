'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Camera, Loader2, Zap, X } from 'lucide-react'
import Link from 'next/link'

type PreviewFoto = { file: File; url: string }

export default function AdicionarMoto() {
  const router = useRouter()
  const { toast } = useToast()
  const foto1Ref = useRef<HTMLInputElement>(null)
  const foto2Ref = useRef<HTMLInputElement>(null)
  const [salvando, setSalvando] = useState(false)
  const [fotos, setFotos] = useState<(PreviewFoto | null)[]>([null, null])
  const [form, setForm] = useState({ marca:'', modelo:'', potencia:'', precoVarejo:'', precoAtacado:'', qtdMinimaAtacado:'', autonomia:'', peso:'', cargaMaxima:'', tempoRecarga:'', voltagem:'', observacoes:'' })

  function handleCampo(campo: string, valor: string) { setForm(prev => ({ ...prev, [campo]: valor })) }

  function handleFoto(index: number, file: File | null) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setFotos(prev => { const novo = [...prev]; novo[index] = { file, url }; return novo })
  }

  function removerFoto(index: number) {
    setFotos(prev => { const novo = [...prev]; if (novo[index]?.url) URL.revokeObjectURL(novo[index]!.url); novo[index] = null; return novo })
    if (index === 0 && foto1Ref.current) foto1Ref.current.value = ''
    if (index === 1 && foto2Ref.current) foto2Ref.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.marca.trim() || !form.modelo.trim()) {
      toast({ title: 'Campos obrigatórios', description: 'Informe a marca e o modelo.', variant: 'destructive' }); return
    }
    setSalvando(true)
    try {
      let fotoUrl1 = null, fotoUrl2 = null
      if (fotos.some(Boolean)) {
        const formData = new FormData()
        if (fotos[0]) formData.append('foto1', fotos[0].file)
        if (fotos[1]) formData.append('foto2', fotos[1].file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!uploadRes.ok) throw new Error('Falha no upload das fotos')
        const { urls } = await uploadRes.json()
        fotoUrl1 = urls[0] || null; fotoUrl2 = urls[1] || null
      }
      const payload = { ...form, precoVarejo: form.precoVarejo ? parseFloat(form.precoVarejo.replace(',','.')) : null, precoAtacado: form.precoAtacado ? parseFloat(form.precoAtacado.replace(',','.')) : null, qtdMinimaAtacado: form.qtdMinimaAtacado ? parseInt(form.qtdMinimaAtacado) : null, fotoUrl1, fotoUrl2 }
      const res = await fetch('/api/motos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const erro = await res.json(); throw new Error(erro.error || 'Erro ao salvar') }
      toast({ title: '✅ Moto salva com sucesso!', description: `${form.marca} ${form.modelo} foi cadastrada.` })
      router.push('/')
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message || 'Tente novamente.', variant: 'destructive' })
    } finally { setSalvando(false) }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-2">
            <div className="bg-green-600 rounded-lg p-1.5"><Zap className="h-4 w-4 text-white" /></div>
            <h1 className="font-bold text-gray-900">Adicionar Moto</h1>
          </div>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">📷 Fotos</h2>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map(i => (
              <div key={i}>
                <Label className="text-sm text-gray-600 mb-2 block">Foto {i + 1} {i === 0 ? '(Principal)' : '(Detalhe)'}</Label>
                {fotos[i] ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square">
                    <Image src={fotos[i]!.url} alt={`Foto ${i+1}`} fill className="object-cover" />
                    <button type="button" onClick={() => removerFoto(i)} className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 aspect-square cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-2">Tirar foto ou escolher arquivo</span>
                    <input type="file" accept="image/*" capture="environment" className="sr-only" ref={i === 0 ? foto1Ref : foto2Ref} onChange={e => handleFoto(i, e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">🏍️ Informações Básicas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="marca">Marca <span className="text-red-500">*</span></Label><Input id="marca" placeholder="Ex: Voltz" value={form.marca} onChange={e => handleCampo('marca', e.target.value)} required /></div>
            <div className="space-y-1"><Label htmlFor="modelo">Modelo <span className="text-red-500">*</span></Label><Input id="modelo" placeholder="Ex: EVS Sport" value={form.modelo} onChange={e => handleCampo('modelo', e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="potencia">Potência</Label><Input id="potencia" placeholder="Ex: 3000W" value={form.potencia} onChange={e => handleCampo('potencia', e.target.value)} /></div>
            <div className="space-y-1"><Label htmlFor="voltagem">Voltagem</Label><Input id="voltagem" placeholder="Ex: 72V" value={form.voltagem} onChange={e => handleCampo('voltagem', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="autonomia">Autonomia</Label><Input id="autonomia" placeholder="Ex: 80 km" value={form.autonomia} onChange={e => handleCampo('autonomia', e.target.value)} /></div>
            <div className="space-y-1"><Label htmlFor="tempoRecarga">Tempo de Recarga</Label><Input id="tempoRecarga" placeholder="Ex: 6-8h" value={form.tempoRecarga} onChange={e => handleCampo('tempoRecarga', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="peso">Peso</Label><Input id="peso" placeholder="Ex: 95 kg" value={form.peso} onChange={e => handleCampo('peso', e.target.value)} /></div>
            <div className="space-y-1"><Label htmlFor="cargaMaxima">Carga Máxima</Label><Input id="cargaMaxima" placeholder="Ex: 150 kg" value={form.cargaMaxima} onChange={e => handleCampo('cargaMaxima', e.target.value)} /></div>
          </div>
        </section>
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">💰 Preços e Atacado</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="precoVarejo">Preço Varejo (R$)</Label><Input id="precoVarejo" type="number" step="0.01" placeholder="Ex: 8500.00" value={form.precoVarejo} onChange={e => handleCampo('precoVarejo', e.target.value)} /></div>
            <div className="space-y-1"><Label htmlFor="precoAtacado">Preço Atacado (R$)</Label><Input id="precoAtacado" type="number" step="0.01" placeholder="Ex: 7200.00" value={form.precoAtacado} onChange={e => handleCampo('precoAtacado', e.target.value)} /></div>
          </div>
          <div className="space-y-1"><Label htmlFor="qtdMinimaAtacado">Qtd. Mínima p/ Atacado</Label><Input id="qtdMinimaAtacado" type="number" placeholder="Ex: 10" value={form.qtdMinimaAtacado} onChange={e => handleCampo('qtdMinimaAtacado', e.target.value)} /></div>
        </section>
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">📝 Observações</h2>
          <Textarea id="observacoes" placeholder="Anotações sobre o fornecedor, qualidade, prazo de entrega, etc." rows={4} value={form.observacoes} onChange={e => handleCampo('observacoes', e.target.value)} />
        </section>
        <div className="pb-8 flex gap-3">
          <Link href="/" className="flex-1"><Button type="button" variant="outline" className="w-full">Cancelar</Button></Link>
          <Button type="submit" disabled={salvando} className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
            {salvando ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : 'Salvar Moto'}
          </Button>
        </div>
      </form>
    </main>
  )
}