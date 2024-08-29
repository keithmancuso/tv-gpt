import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, app, status, review } = req.body;

  try {
    const result = await sql`
      INSERT INTO shows (name, app, status, review)
      VALUES (${name}, ${app}, ${status}, ${review})
      RETURNING id
    `;
    res.status(201).json({ message: 'Show created successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to create show' });
  }
}