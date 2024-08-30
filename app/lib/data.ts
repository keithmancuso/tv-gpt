import { sql, QueryResultRow } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
   Show
  } from './definitions';



export async function fetchShows(status: string) {
  noStore();
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

export async function fetchAllShows() {

  noStore();


  try {
    const data = await sql`
      SELECT * FROM shows
      ORDER BY status, name ASC
    `;
    
    const groupedShows: { [key: string]: Show[] } = {};
    
    data.rows.forEach((show: QueryResultRow) => {
      const typedShow = show as Show;
      if (!groupedShows[typedShow.status]) {
        groupedShows[typedShow.status] = [];
      }
      groupedShows[typedShow.status].push(typedShow);
    });

    return groupedShows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch and group shows data.');
  }
}


export async function fetchShowById(id: string) {
  // Implement the logic to fetch a single show by ID
  // This might involve a database query or API call
  // Return null if the show is not found
  try {
    const data = await sql`
      SELECT * FROM shows
      WHERE id = ${id}
    `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch show data.');
  }
}