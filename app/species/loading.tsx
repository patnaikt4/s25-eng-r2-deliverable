// app/species/[id]/page.tsx (Server Component)

import { createServerSupabaseClient } from "@/lib/server-utils";
import EditSpeciesDialog from "@/components/editspecies";

export default async function SpeciesPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: species, error } = await supabase
    .from("species")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error ?? !species) {
    return <p>Species not found.</p>;
  }

  return <EditSpeciesDialog userId="YOUR_USER_ID" species={species} />;
}
