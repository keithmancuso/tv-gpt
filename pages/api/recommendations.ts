import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";

import { fetchAllShows } from '@/app/lib/data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Recommendation = z.object({
    title: z.string(),
    reason: z.string(),
    status: z.string(),
});

const RecommendationArray = z.array(Recommendation).length(5);

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

type Message = z.infer<typeof MessageSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  

  try {
    const { messages } = req.body;
    const shows = await fetchAllShows();
    const showsData = JSON.stringify(shows);

    const validatedMessages = z.array(MessageSchema).parse(messages);

    const systemMessage: Message = {
      role: "system",
      content: `You are a TV show recommendation assistant. Always provide exactly 5 recommendations in JSON format. Each recommendation should include title, reason, and status. Here's the user's current watch list: ${showsData}`
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [systemMessage, ...validatedMessages] as Message[],
      response_format: zodResponseFormat(RecommendationArray, "recommendations"),
    });

    const content = completion.choices[0].message.content || '{}';
    const parsedContent = JSON.parse(content);

    console.log(parsedContent);
    const validatedResponse = RecommendationArray.parse(parsedContent);
    res.status(200).json(validatedResponse);
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Invalid response format from OpenAI', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to process the request' });
    }
  }
}