"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Species = Database["public"]["Tables"]["species"]["Row"];

// Define Zod validation schema for editing
const speciesSchema = z.object({
  scientific_name: z.string().trim().min(1),
  common_name: z.string().nullable(),
  description: z.string().nullable(),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog({
  species,
  isOpen,
  onClose,
}: {
  species: Species;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  // Setup form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name || "",
      common_name: species.common_name ?? "",
      description: species.description ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = async (input: FormData) => {
    console.log("🛠 Submitting Edit Form:", input); // Debugging

    setLoading(true);
    const { error } = await supabase
      .from("species")
      .update({
        scientific_name: input.scientific_name,
        common_name: input.common_name,
        description: input.description,
      })
      .eq("id", species.id);

    setLoading(false);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    console.log("✅ Update successful! Refreshing page...");

    form.reset(input);
    onClose();
    router.refresh();

    return toast({
      title: "Species Updated!",
      description: "Successfully updated " + input.scientific_name + ".",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>Update the species details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <FormField
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Cavia porcellus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="common_name"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Common Name</FormLabel>
                    <FormControl>
                      <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea value={value ?? ""} placeholder="Enter species description..." {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex">
              <Button type="submit" className="ml-1 mr-1 flex-auto" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <DialogClose asChild>
                <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
