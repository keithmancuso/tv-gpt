import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const { rows: shows } = status
    ? await sql`SELECT id, name, app, status, rating, review, favorite FROM shows WHERE status = ${status}`
    : await sql`SELECT id, name, app, status, rating, review, favorite FROM shows`;
      res.status(200).json({ shows });
  } else if (req.method === 'POST') {
    const { name, app, status, rating, review, favorite } = req.body;
    await sql`INSERT INTO shows (name, app, status, rating, review, favorite) VALUES (${name}, ${app}, ${status}, ${rating}, ${review}, ${favorite})`;
    res.status(201).json({ message: 'Show added' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}