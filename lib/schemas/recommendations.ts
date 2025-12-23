import { z } from "zod";

export const RecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      distance: z.string(),
      why: z.string(),
      best_time: z.string(),
      duration: z.string(),
      difficulty: z.string(),
      weather: z.object({
        condition: z.string(),
        temperature: z.string(),
        advice: z.string(),
      }),
      transport: z.array(z.string()),
      what_to_carry: z.array(z.string()),
      safety_notes: z.array(z.string()),
    })
  ),
});

export type RecommendationResponse = z.infer<typeof RecommendationSchema>;
export type Recommendation = RecommendationResponse["recommendations"][number];

