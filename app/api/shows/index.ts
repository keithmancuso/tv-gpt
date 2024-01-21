import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function handler(request: Request) {
    if (request.method === 'POST') {
        const { title, app, status } = request.body;
        await sql`INSERT INTO shows (title, app, status) VALUES ($1, $2, $3)', [title, app, status]`;

        return NextResponse.json({ message: 'Show added'  }, { status: 200 });

    } else if (request.method === 'GET') {
        const shows = await sql`SELECT * FROM shows`;
        
        return NextResponse.json({ shows }, { status: 200 });

    }
}

