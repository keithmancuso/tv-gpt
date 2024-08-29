'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
   
    name: z.string(),
    app: z.string(),
    status: z.enum(['Watching', 'Next', 'Loved']).optional()
  });

const CreateShow = FormSchema.omit({});

export async function createShow(data: {
  name: string;
  app: string;
  status?: 'Watching' | 'Next' | 'Loved';
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

export async function deleteShow(formData: FormData) {
    const id = formData.get('id')?.toString();
    const path = formData.get('path') as string;
    
    if (!id) {
        throw new Error('Show ID is required');
    }

    try {
        await sql`DELETE FROM shows WHERE id = ${id}`
        revalidatePath(path)
    } catch (error) {
        console.error('Failed to delete show:', error)
    }
}

const UpdateShow = z.object({
  id: z.string(),
  app: z.string().optional(),
  status: z.enum(['Watching', 'Next', 'Loved']).optional(),
});

export async function updateShow(formData: FormData) {
  const { id, app, status } = UpdateShow.parse({
    id: formData.get('id'),
    app: formData.get('app'),
    status: formData.get('status'),
  });

  try {
    let updateFields = [];
    let updateValues = [];

    if (app !== undefined) {
      updateFields.push(`app = $${updateValues.length + 1}`);
      updateValues.push(app);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${updateValues.length + 1}`);
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      console.log('No fields to update.');
      return { message: 'No fields to update.' };
    }

    const updateQuery = `
      UPDATE shows
      SET ${updateFields.join(', ')}
      WHERE id = $${updateValues.length + 1}
    `;
    updateValues.push(id);

    await sql.query(updateQuery, updateValues);

    console.log('Show updated successfully');
    revalidatePath('/');
    
    console.log(`Redirecting to /?status=${status}`);
    redirect(`/?status=${status}`);
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw the redirect "error"
    }
    console.error('Error updating show:', error);
    return {
      message: 'Database Error: Failed to Update Show.',
    };
  }
}





 