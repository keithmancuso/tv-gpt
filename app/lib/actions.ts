'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
   
    name: z.string(),
    app: z.string()
  });

const CreateShow = FormSchema.omit({});

export async function createShow(formData: FormData) {
    const { name, app } = CreateShow.parse({
        name: formData.get('name'),
        app: formData.get('app'),
    });
    try {
        await sql`
            INSERT INTO shows (name, app)
            VALUES (${name}, ${app})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Show.',
        };
    }

  }





 