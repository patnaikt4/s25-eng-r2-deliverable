"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailDialog({ species }: { species: Species }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          <DialogDescription>{species.common_name ?? "No common name available"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <b>Kingdom:</b> {species.kingdom}
          </p>
          <p>
            <b>Total Population:</b> {species.total_population ?? "Unknown"}
          </p>
          <p>
            <b>Description:</b> {species.description ?? "No description available."}
          </p>
          <p>
            <b>Scientific Name:</b> {species.scientific_name ?? "No description available."}
          </p>
        </div>
        <DialogClose asChild>
          <Button variant="secondary" className="mt-4 w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
