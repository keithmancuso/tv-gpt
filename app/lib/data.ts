import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
   Show
  } from './definitions';



export async function fetchShows(status: string) {
  try {
    const data = await sql`
      SELECT * FROM shows
      WHERE status = ${status}
      ORDER BY name ASC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shows data.');
  }
}