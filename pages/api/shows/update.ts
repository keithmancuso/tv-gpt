import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, app, status, review } = req.body;

  try {
    if (review === null) {
      await sql`
        UPDATE shows
        SET app = ${app}, status = ${status}, review = NULL
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE shows
        SET app = ${app}, status = ${status}, review = ${review}
        WHERE id = ${id}
      `;
    }
    res.status(200).json({ message: 'Show updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to update show' });
  }
}