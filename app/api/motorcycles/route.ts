import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const motorcycle = await prisma.motorcycle.create({
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
        imageUrl1: data.imageUrl1,
        imageUrl2: data.imageUrl2,
      },
    });

    return NextResponse.json(motorcycle, { status: 201 });
  } catch (error: any) {
    console.error('Error creating motorcycle:', error);
    return NextResponse.json({ 
      error: 'Failed to create motorcycle', 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const motorcycles = await prisma.motorcycle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(motorcycles);
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    return NextResponse.json({ error: 'Failed to fetch motorcycles' }, { status: 500 });
  }
}
