import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('busca') || ''
    const motos = await prisma.moto.findMany({
      where: busca ? { OR: [{ marca: { contains: busca, mode: 'insensitive' } }, { modelo: { contains: busca, mode: 'insensitive' } }] } : undefined,
      orderBy: { criadoEm: 'desc' },
    })
    return NextResponse.json(motos)
  } catch (error) {
    console.error('Erro ao listar motos:', error)
    return NextResponse.json({ error: 'Erro interno ao buscar motos.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { marca, modelo, potencia, precoVarejo, precoAtacado, qtdMinimaAtacado, autonomia, peso, cargaMaxima, tempoRecarga, voltagem, observacoes, fotoUrl1, fotoUrl2 } = body
    if (!marca || !modelo) return NextResponse.json({ error: 'Marca e Modelo são obrigatórios.' }, { status: 400 })
    const moto = await prisma.moto.create({
      data: {
        marca, modelo,
        potencia: potencia || null,
        precoVarejo: precoVarejo ? parseFloat(precoVarejo) : null,
        precoAtacado: precoAtacado ? parseFloat(precoAtacado) : null,
        qtdMinimaAtacado: qtdMinimaAtacado ? parseInt(qtdMinimaAtacado) : null,
        autonomia: autonomia || null, peso: peso || null, cargaMaxima: cargaMaxima || null,
        tempoRecarga: tempoRecarga || null, voltagem: voltagem || null,
        observacoes: observacoes || null, fotoUrl1: fotoUrl1 || null, fotoUrl2: fotoUrl2 || null,
      },
    })
    return NextResponse.json(moto, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar moto:', error)
    return NextResponse.json({ error: 'Erro interno ao salvar moto.' }, { status: 500 })
  }
}
