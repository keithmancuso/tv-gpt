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
        const { name, title, app, status, rating, review, favorite } = req.body;

        
        let fields="";
        if (title) {
            fields += `SET title = ${title}`
        }
        if (app) {
            fields += `SET app = ${app}`
        }
        if (status) {
            fields += `SET status = ${status}`
        }
        if (rating) {
            fields += `SET rating = ${rating}`
        }
        if (review) {
            fields += `SET review = ${review}`
        }
        if (favorite) {
            fields += `SET favorite = ${favorite}`
        }
        await sql`UPDATE shows `+fields + `WHERE id = ${id}`;
        res.status(200).json({ message: 'Show updated' });
    } else if (req.method === 'DELETE') {
        await sql`DELETE FROM shows WHERE id = ${id}`;
        res.status(200).json({ message: 'Show deleted' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}