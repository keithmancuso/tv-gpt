import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

import {
   Show
  } from './definitions';



export async function fetchWatching() {
    // Add noStore() here prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
    noStore();
  
  
    try {
    
      console.log('Fetching show data...');
  
      const data = await sql<Show>`SELECT * FROM shows`;
  
      console.log('Data fetch completed after 3 seconds.');
  
      return data.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch revenue data.');
    }
  }