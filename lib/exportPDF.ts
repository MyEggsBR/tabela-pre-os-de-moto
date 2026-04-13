// lib/exportPDF.ts
type Moto = { id:number; marca:string; modelo:string; potencia:string|null; precoVarejo:number|null; precoAtacado:number|null; qtdMinimaAtacado:number|null; autonomia:string|null; peso:string|null; cargaMaxima:string|null; tempoRecarga:string|null; voltagem:string|null; observacoes:string|null; fotoUrl1:string|null; fotoUrl2:string|null }

function formatarMoeda(valor: number | null) {
  if (valor === null || valor === undefined) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return await new Promise(resolve => { const r = new FileReader(); r.onloadend = () => resolve(r.result as string); r.onerror = () => resolve(null); r.readAsDataURL(blob) })
  } catch { return null }
}

export async function exportarPDF(motos: Moto[]) {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const dataAtual = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' })
  doc.setFillColor(22, 101, 52)
  doc.rect(0, 0, 297, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14); doc.setFont('helvetica', 'bold')
  doc.text('Relatório de Curadoria - Trivolts Motors', 14, 10)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal')
  doc.text(`Gerado em: ${dataAtual}  |  Total: ${motos.length} moto(s)`, 14, 17)
  const tableBody: any[][] = []
  for (const moto of motos) {
    const imgData = moto.fotoUrl1 ? await imageUrlToBase64(moto.fotoUrl1) : null
    tableBody.push([imgData ? { content: '', styles: { minCellHeight: 25 }, image: imgData } : '—', `${moto.marca}\n${moto.modelo}`, moto.potencia||'—', moto.voltagem||'—', moto.autonomia||'—', formatarMoeda(moto.precoVarejo), formatarMoeda(moto.precoAtacado), moto.qtdMinimaAtacado ? `${moto.qtdMinimaAtacado} un.` : '—', moto.tempoRecarga||'—', moto.observacoes||'—'])
  }
  autoTable(doc, {
    startY: 26,
    head: [['Foto','Marca / Modelo','Potência','Voltagem','Autonomia','Preço Varejo','Preço Atacado','Qtd. Mín.','Recarga','Observações']],
    body: tableBody,
    styles: { fontSize: 8, cellPadding: 3, valign: 'middle', overflow: 'linebreak' },
    headStyles: { fillColor: [22, 101, 52], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    columnStyles: { 0:{cellWidth:28}, 1:{cellWidth:35}, 2:{cellWidth:22}, 3:{cellWidth:18}, 4:{cellWidth:22}, 5:{cellWidth:28}, 6:{cellWidth:28}, 7:{cellWidth:18}, 8:{cellWidth:18}, 9:{cellWidth:'auto'} },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    didDrawCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 0 && data.cell.raw?.image) {
        try { doc.addImage(data.cell.raw.image, 'JPEG', data.cell.x+1, data.cell.y+1, 26, data.cell.height-2) } catch (_) {}
      }
    },
    margin: { left: 10, right: 10 },
  })
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setFontSize(7); doc.setTextColor(150); doc.text(`Trivolts Motors — Uso Interno · Página ${i} de ${pageCount}`, 297/2, 205, { align: 'center' }) }
  doc.save(`curadoria-trivolts-${dataAtual.replace(/\//g, '-')}.pdf`)
}