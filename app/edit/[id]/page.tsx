'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditMotorcycle({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    brandModel: '',
    power: '',
    batteryType: 'Lítio',
    batteryCapacity: '',
    tireSize: '',
    retailPrice: '',
    wholesalePrice: '',
    minWholesaleQty: '',
    notes: '',
  });

  const [images, setImages] = useState<{ front: File | null; side: File | null }>({
    front: null,
    side: null,
  });
  const [previews, setPreviews] = useState<{ front: string | null; side: string | null }>({
    front: null,
    side: null,
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/motorcycles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setFormData({
          brandModel: data.brandModel || '',
          power: data.power || '',
          batteryType: data.batteryType || 'Lítio',
          batteryCapacity: data.batteryCapacity || '',
          tireSize: data.tireSize || '',
          retailPrice: data.retailPrice || '',
          wholesalePrice: data.wholesalePrice || '',
          minWholesaleQty: data.minWholesaleQty || '',
          notes: data.notes || '',
        });
        setPreviews({
          front: data.imageUrl1 || null,
          side: data.imageUrl2 || null,
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar dados da moto.');
        router.push('/inventory');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleImageChange = (type: 'front' | 'side', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToMinio = async (file: File) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      
      if (!res.ok) throw new Error('Failed to get presigned URL');
      const { presignedUrl, publicUrl } = await res.json();

      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) throw new Error('Failed to upload file to S3');

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return `https://picsum.photos/seed/${Math.random()}/800/600`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl1 = null;
      let imageUrl2 = null;

      if (images.front) imageUrl1 = await uploadToMinio(images.front);
      if (images.side) imageUrl2 = await uploadToMinio(images.side);

      const res = await fetch(`/api/motorcycles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(imageUrl1 && { imageUrl1 }),
          ...(imageUrl2 && { imageUrl2 }),
        }),
      });

      if (res.ok) {
        router.push('/inventory');
      } else {
        alert('Erro ao atualizar motocicleta');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <>
      <header className="w-full top-0 sticky z-40 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/inventory" className="text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold font-headline text-primary">Sourcing</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 pb-32 space-y-8 w-full">
        <section className="space-y-2">
          <h2 className="text-2xl font-extrabold font-headline tracking-tighter text-on-surface">Editar Produto</h2>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Atualize as especificações técnicas da motocicleta.</p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => frontInputRef.current?.click()}
            className="group relative aspect-square bg-surface-container-low rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
          >
            {previews.front ? (
              <img src={previews.front} alt="Vista Frontal" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="text-primary mb-2" size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Vista Frontal</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={frontInputRef}
              onChange={(e) => handleImageChange('front', e)}
            />
          </div>

          <div 
            onClick={() => sideInputRef.current?.click()}
            className="group relative aspect-square bg-surface-container-low rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
          >
            {previews.side ? (
              <img src={previews.side} alt="Vista Lateral" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="text-primary mb-2" size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Vista Lateral</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={sideInputRef}
              onChange={(e) => handleImageChange('side', e)}
            />
          </div>
        </section>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Marca e Modelo</label>
              <input 
                type="text" 
                required
                value={formData.brandModel}
                onChange={(e) => setFormData({...formData, brandModel: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                placeholder="Ex: Volt-X 500" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Potência (W)</label>
                <input 
                  type="text" 
                  value={formData.power}
                  onChange={(e) => setFormData({...formData, power: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                  placeholder="3000W" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Tipo de Bateria</label>
                <select 
                  value={formData.batteryType}
                  onChange={(e) => setFormData({...formData, batteryType: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="Lítio">Lítio</option>
                  <option value="Chumbo-Ácido">Chumbo-Ácido</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Capacidade (Ah/V)</label>
                <input 
                  type="text" 
                  value={formData.batteryCapacity}
                  onChange={(e) => setFormData({...formData, batteryCapacity: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                  placeholder="72V 20Ah" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Medida do Pneu</label>
                <input 
                  type="text" 
                  value={formData.tireSize}
                  onChange={(e) => setFormData({...formData, tireSize: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                  placeholder="90/90-12" 
                />
              </div>
            </div>

            <div className="p-5 bg-surface-container-highest/30 rounded-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Preço Varejo</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant">R$</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={formData.retailPrice}
                      onChange={(e) => setFormData({...formData, retailPrice: e.target.value})}
                      className="w-full bg-surface-container-lowest border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                      placeholder="0,00" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Preço Atacado</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant">R$</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={formData.wholesalePrice}
                      onChange={(e) => setFormData({...formData, wholesalePrice: e.target.value})}
                      className="w-full bg-surface-container-lowest border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                      placeholder="0,00" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Qtd. Mínima Atacado</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={formData.minWholesaleQty}
                  onChange={(e) => setFormData({...formData, minWholesaleQty: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant" 
                  placeholder="5 unidades" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Outros / Observações</label>
              <textarea 
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant resize-none" 
                placeholder="Detalhes adicionais sobre suspensão, freios ou acabamento..." 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold font-headline py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Save size={20} />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </main>
    </>
  );
}
