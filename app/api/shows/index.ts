import { NextApiRequest, NextApiResponse } from 'next';
import { withPostgres, QueryClient } from '@vercel/postgres';

async function handler(req: NextApiRequest, res: NextApiResponse, client: QueryClient) {
    if (req.method === 'POST') {
        const { title, app, status } = req.body;
        await client.query('INSERT INTO shows (title, app, status) VALUES ($1, $2, $3)', [title, app, status]);
        return res.status(201).json({ message: 'Show added' });
    } else if (req.method === 'GET') {
        const { rows } = await client.query('SELECT * FROM shows');
        return res.status(200).json(rows);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withPostgres(handler);
