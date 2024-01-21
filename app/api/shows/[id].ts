import { NextApiRequest, NextApiResponse } from 'next';
import { withPostgres, QueryClient } from '@vercel/postgres';

async function handler(req: NextApiRequest, res: NextApiResponse, client: QueryClient) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { title, app, status } = req.body;
        await client.query('UPDATE shows SET title = $1, app = $2, status = $3 WHERE id = $4', [title, genre, status, id]);
        return res.status(200).json({ message: 'Show updated' });
    } else if (req.method === 'DELETE') {
        await client.query('DELETE FROM shows WHERE id = $1', [id]);
        return res.status(200).json({ message: 'Show deleted' });
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withPostgres(handler);
