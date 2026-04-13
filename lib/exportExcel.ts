// lib/exportExcel.ts
type Moto = { id:number; marca:string; modelo:string; potencia:string|null; precoVarejo:number|null; precoAtacado:number|null; qtdMinimaAtacado:number|null; autonomia:string|null; peso:string|null; cargaMaxima:string|null; tempoRecarga:string|null; voltagem:string|null; observacoes:string|null; fotoUrl1:string|null; fotoUrl2:string|null; criadoEm:string }

export async function exportarExcel(motos: Moto[]) {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Trivolts Motors'
  workbook.created = new Date()
  const sheet = workbook.addWorksheet('Curadoria de Motos', { pageSetup: { orientation: 'landscape', fitToPage: true } })
  sheet.mergeCells('A1:L1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = 'Relatório de Curadoria - Trivolts Motors'
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166534' } }
  sheet.getRow(1).height = 30
  sheet.mergeCells('A2:L2')
  const subtitleCell = sheet.getCell('A2')
  subtitleCell.value = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} · Total: ${motos.length} moto(s)`
  subtitleCell.font = { italic: true, size: 10, color: { argb: 'FF6B7280' } }
  subtitleCell.alignment = { horizontal: 'center' }
  sheet.getRow(2).height = 18
  const headers = ['ID','Marca','Modelo','Potência','Voltagem','Autonomia','Preço Varejo (R$)','Preço Atacado (R$)','Qtd. Mín. Atacado','Tempo de Recarga','Peso','Carga Máxima','Observações','URL Foto 1','Cadastrado em']
  const headerRow = sheet.addRow(headers)
  headerRow.eachCell(cell => { cell.font={bold:true,color:{argb:'FFFFFFFF'},size:10}; cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF16A34A'}}; cell.alignment={horizontal:'center',vertical:'middle',wrapText:true}; cell.border={bottom:{style:'thin',color:{argb:'FF166534'}}} })
  headerRow.height = 22
  motos.forEach((moto, idx) => {
    const row = sheet.addRow([moto.id,moto.marca,moto.modelo,moto.potencia||'',moto.voltagem||'',moto.autonomia||'',moto.precoVarejo??'',moto.precoAtacado??'',moto.qtdMinimaAtacado??'',moto.tempoRecarga||'',moto.peso||'',moto.cargaMaxima||'',moto.observacoes||'',moto.fotoUrl1||'',new Date(moto.criadoEm).toLocaleDateString('pt-BR')])
    const rowFill = idx%2===0 ? {type:'pattern' as const,pattern:'solid' as const,fgColor:{argb:'FFF0FDF4'}} : {type:'pattern' as const,pattern:'solid' as const,fgColor:{argb:'FFFFFFFF'}}
    row.eachCell(cell => { cell.fill=rowFill; cell.alignment={vertical:'middle',wrapText:true}; cell.font={size:9} })
    row.getCell(7).numFmt='R$ #,##0.00'
    const ac=row.getCell(8); ac.numFmt='R$ #,##0.00'; ac.font={size:9,color:{argb:'FF166534'},bold:true}
    row.height=18
  })
  const colWidths=[6,16,18,12,12,14,18,18,16,16,12,14,30,40,14]
  colWidths.forEach((w,i) => { sheet.getColumn(i+1).width=w })
  sheet.views=[{state:'frozen',ySplit:3}]
  sheet.autoFilter={from:{row:3,column:1},to:{row:3+motos.length,column:headers.length}}
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href=url; a.download=`curadoria-trivolts-${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.xlsx`; a.click()
  URL.revokeObjectURL(url)
}