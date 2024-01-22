import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { id, name, title, app, status, rating, review, favorite } = req.body;

  if (req.method === 'GET') {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const { rows: shows } = status
    ? await sql`SELECT id, name, app, status, rating, review, favorite FROM shows WHERE status = ${status}`
    : await sql`SELECT id, name, app, status, rating, review, favorite FROM shows`;
      res.status(200).json({ shows });
  } else if (req.method === 'POST') {
    await sql`INSERT INTO shows (name, app, status, rating, review, favorite) VALUES (${name}, ${app}, ${status}, ${rating}, ${review}, ${favorite})`;
    res.status(201).json({ message: 'Show added' });

  } else if (req.method === 'PUT') {

    if (!id) {
      res.status(400).json({ message: 'Missing show ID' });
      return;
    }
    const idNumber = parseInt(id, 10);
    
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
    await sql`UPDATE shows `+fields + `WHERE id = ${idNumber}`;
    res.status(200).json({ message: 'Show updated' });
  } else if (req.method === 'DELETE') {
    if (!id) {
      res.status(400).json({ message: 'Missing show ID' });
      return;
    } 
    const idNumber = parseInt(id, 10);
    await sql`DELETE FROM shows WHERE id = ${idNumber}`;
    res.status(200).json({ message: 'Show deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  } 
}