import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Show ID is required' });
  }

  try {
    await sql`DELETE FROM shows WHERE id = ${id}`;
    res.status(200).json({ message: 'Show deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to delete show' });
  }
}