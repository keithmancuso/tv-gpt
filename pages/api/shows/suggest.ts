import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that suggests TV show titles." },
        { role: "user", content: `Suggest 5 TV show titles similar to "${query}". Respond with only the titles, separated by commas.` }
      ],
    });

    const suggestions = completion.choices[0].message.content?.split(',').map(s => s.trim()) || [];
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}
