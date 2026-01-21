import { z } from "zod";

export const DisposalRecommendationSchema = z.object({
  item: z.string().describe("The name/description of the item identified"),
  material: z.string().describe("Primary material(s) the item is made of"),
  category: z.string().describe("Waste category (e.g., 'Plastic', 'Electronic', 'Organic', 'Hazardous', 'General Waste')"),
  disposal_method: z.string().describe("Recommended disposal method (e.g., 'Recycle', 'Compost', 'Landfill', 'Special Collection', 'Reuse')"),
  disposal_steps: z.array(z.string()).describe("Step-by-step instructions for proper disposal"),
  recycling_available: z.boolean().describe("Whether recycling options are available for this item"),
  hazards: z.array(z.string()).optional().describe("Potential hazards or safety concerns"),
  local_notes: z.string().describe("Kenya-specific disposal information, locations, or regulations"),
  location_info: z.string().optional().describe("Specific locations or facilities in Kenya where this can be disposed"),
  environmental_impact: z.string().optional().describe("Brief note on environmental impact"),
});

export type DisposalRecommendation = z.infer<typeof DisposalRecommendationSchema>;
