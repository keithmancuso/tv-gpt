import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showName = searchParams.get('name');
  const app = searchParams.get('app');
 
  try {
    if (!showName || !app) throw new Error('Pet and owner names required');
    await sql`INSERT INTO Shows (Name, App, Status) VALUES (${showName}, ${app}, 'Watching');`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
 
  const pets = await sql`SELECT * FROM Shows;`;
  return NextResponse.json({ pets }, { status: 200 });
}