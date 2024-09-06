import { z } from 'zod';

export const recommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const zodResponseFormat = z.object({
  title: z.string(),
  description: z.string(),
  recommendations: z.array(recommendationSchema).length(5),
});

export type RecommendationResponse = z.infer<typeof zodResponseFormat>;