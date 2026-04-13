import { NextRequest, NextResponse } from 'next/server'
import { uploadToMinio } from '@/lib/minio'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const urls: string[] = []
    const foto1 = formData.get('foto1') as File | null
    const foto2 = formData.get('foto2') as File | null
    const fotos = [foto1, foto2].filter(Boolean) as File[]
    for (const foto of fotos) {
      const bytes = await foto.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = foto.name.split('.').pop() || 'jpg'
      const objectName = `motos/${uuidv4()}.${ext}`
      const url = await uploadToMinio(buffer, objectName, foto.type || 'image/jpeg')
      urls.push(url)
    }
    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload das imagens.' }, { status: 500 })
  }
}
