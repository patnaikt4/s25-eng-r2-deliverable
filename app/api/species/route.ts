import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/server-utils";

// Define the expected structure of the request body
interface SpeciesRequestBody {
  userId: string;
  scientific_name: string;
  common_name: string | null;
  kingdom: string;
  total_population: number | null;
  image: string | null;
  description: string | null;
}

export async function POST(req: Request) {
  try {
    // Parse request JSON with explicit type
    const body: SpeciesRequestBody = await req.json();

    // Extract values safely
    const { userId, scientific_name, common_name, kingdom, total_population, image, description } = body;

    if (!userId || !scientific_name || !kingdom) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Initialize Supabase
    const supabase = createServerSupabaseClient();

    // Insert data into Supabase
    const { error } = await supabase.from("species").insert([
      {
        author: userId,
        scientific_name,
        common_name,
        kingdom,
        total_population,
        image,
        description,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Species added successfully!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
