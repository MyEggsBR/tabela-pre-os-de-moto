import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });
    if (!motorcycle) {
      return NextResponse.json({ error: 'Motocicleta não encontrada' }, { status: 404 });
    }
    return NextResponse.json(motorcycle);
  } catch (error) {
    console.error('Error fetching motorcycle:', error);
    return NextResponse.json({ error: 'Erro ao buscar motocicleta' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    
    const motorcycle = await prisma.motorcycle.update({
      where: { id },
      data: {
        brandModel: data.brandModel,
        power: data.power,
        batteryType: data.batteryType,
        batteryCapacity: data.batteryCapacity,
        tireSize: data.tireSize,
        retailPrice: data.retailPrice,
        wholesalePrice: data.wholesalePrice,
        minWholesaleQty: data.minWholesaleQty,
        notes: data.notes,
        ...(data.imageUrl1 && { imageUrl1: data.imageUrl1 }),
        ...(data.imageUrl2 && { imageUrl2: data.imageUrl2 }),
      },
    });

    return NextResponse.json(motorcycle);
  } catch (error) {
    console.error('Error updating motorcycle:', error);
    return NextResponse.json({ error: 'Erro ao atualizar motocicleta' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.motorcycle.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting motorcycle:', error);
    return NextResponse.json({ error: 'Erro ao excluir motocicleta' }, { status: 500 });
  }
}
