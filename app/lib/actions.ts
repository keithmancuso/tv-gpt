'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
   
    name: z.string(),
    app: z.string(),
    status: z.enum(['Watching', 'Next', 'Watched']).optional()
  });

const CreateShow = FormSchema.omit({});

export async function createShow(data: {
  name: string;
  app: string;
  status?: 'Watching' | 'Next' | 'Watched';
}) {
  const { name, app, status = 'Next' } = CreateShow.parse(data);
  try {
    await sql`
      INSERT INTO shows (name, app, status)
      VALUES (${name}, ${app}, ${status})
    `;
    revalidatePath('/');
    return { message: 'Show created successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Show.',
    };
  }
}






 