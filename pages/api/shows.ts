import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { rows: shows } = await sql`SELECT name, app, status FROM shows`;
    res.status(200).json({ shows });
  } else if (req.method === 'POST') {
    const { name, app, status } = req.body;
    await sql`INSERT INTO shows (name, app, status) VALUES (${name}, ${app}, ${status})`;
    res.status(201).json({ message: 'Show added' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}