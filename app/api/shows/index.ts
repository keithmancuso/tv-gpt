import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
   
        const shows = await sql`SELECT * FROM shows`;
        
        return NextResponse.json({ shows }, { status: 200 });


}

export async function POST(request: Request) {

    const body = await request.json();
    const { title, app, status } = body;
    await sql`INSERT INTO shows (title, app, status) VALUES ($1, $2, $3)', [title, app, status]`;

    return NextResponse.json({ message: 'Show added'  }, { status: 200 });

}

