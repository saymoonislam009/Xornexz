import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Direct upload endpoint removed. Use /api/admin/media/presign instead.' },
    { status: 410 }
  )
}
