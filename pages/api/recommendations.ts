import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { fetchAllShows } from '@/app/lib/data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shows = await fetchAllShows();
    const showsData = JSON.stringify(shows);

    const thread = await openai.beta.threads.create();
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Based on the following list of shows I'm currently watching, want to watch next or have watched, what should I watch tonight? Here's my current watch list: ${showsData}`
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_xldr6ARBwgyh52Vu0TGBHbwx"
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Retrieve the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data[0].content[0];

    const recommendation = 'text' in assistantResponse ? assistantResponse.text.value : 'No text response available';

    res.status(200).json({ recommendation });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
}