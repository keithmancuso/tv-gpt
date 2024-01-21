// pages/api/shows/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid show ID' });
        return;
    }

    if (req.method === 'PUT') {
        const { title, app, status } = req.body;
        await sql`UPDATE shows SET title = ${title}, app = ${app}, status = ${status} WHERE id = ${id}`;
        res.status(200).json({ message: 'Show updated' });
    } else if (req.method === 'DELETE') {
        await sql`DELETE FROM shows WHERE id = ${id}`;
        res.status(200).json({ message: 'Show deleted' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}