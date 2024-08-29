import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    try {
        const result = await sql`
            SELECT * FROM shows
            WHERE id = ${id}
        `;
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Show not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Failed to fetch show data' });
    }
}