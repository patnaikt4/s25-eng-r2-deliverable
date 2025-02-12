import { z } from "zod";

// Get possible `kingdom` values from Database Enums
const kingdomValues = ["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"] as const;

// Define the Zod schema for species validation
export const speciesSchema = z.object({
  scientific_name: z.string().min(1, "Scientific name is required"),
  common_name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  kingdom: z.enum(kingdomValues),
  total_population: z.number().int().positive().optional(),
});
