"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import supabase from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";
import EditSpeciesDialog from "./editspecies";
import SpeciesDetailDialog from "./speciesdetail";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, sessionId }: { species: Species; sessionId: string }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Function to delete species
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${species.scientific_name}?`)) {
      return; // Exit if the user cancels
    }

    setDeleting(true);

    const { data, error } = await supabase.from("species").delete().eq("id", species.id).select(); // Fetch response to confirm deletion

    setDeleting(false);

    if (error) {
      console.error("❌ Deletion failed:", error.message);
      return toast({
        title: "Error",
        description: `Failed to delete species: ${error.message}`,
        variant: "destructive",
      });
    }

    if (data.length === 0) {
      console.log("⚠️ No rows deleted. Check if Row Level Security (RLS) is enabled.");
    } else {
      console.log("✅ Species deleted:", data);
    }

    toast({
      title: "Species Deleted",
      description: `"${species.scientific_name}" has been removed.`,
    });

    window.location.reload();
  };

  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      {/* Show Species Details */}
      <SpeciesDetailDialog species={species} />

      {/* Show Edit/Delete buttons only if the logged-in user is the author */}
      {sessionId === species.author && (
        <div className="mt-3 flex justify-between">
          <Button
            onClick={() => setEditDialogOpen(true)}
            className="mr-1 w-1/2 bg-blue-500 text-white hover:bg-blue-700"
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            className="ml-1 w-1/2 bg-red-500 text-white hover:bg-red-700"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}

      {/* Render the Edit Dialog when the button is clicked */}
      {editDialogOpen && (
        <EditSpeciesDialog species={species} isOpen={editDialogOpen} onClose={() => setEditDialogOpen(false)} />
      )}
    </div>
  );
}
