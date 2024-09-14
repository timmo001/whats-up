"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { LocateFixed, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const ProfileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  latitude: z.number(),
  longitude: z.number(),
});
type Profile = z.infer<typeof ProfileSchema>;

export function UpdateProfile({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { userId } = useAuth();

  const utils = api.useUtils();

  const initialProfile = api.profile.get.useQuery({ userId: userId });

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.profile.invalidate();
      toast.success("Profile updated successfully");
      console.log("Profile updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Error updating profile. See console for details.");
      console.error(error);
    },
  });

  const form = useForm<Profile>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      latitude: 32,
      longitude: 104.9,
    },
  });

  function onGetLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude);
        form.setValue("longitude", position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  }

  function onSubmit() {
    const data: Profile = ProfileSchema.parse({
      name: form.getValues("name"),
      latitude: Number(form.getValues("latitude")),
      longitude: Number(form.getValues("longitude")),
    });
    console.log("Update profile:", data);

    if (!userId) {
      const message = "Error updating profile: User ID not found";
      console.error(message);
      toast.error(message);
      return;
    }

    updateProfile.mutate({
      userId: userId,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }

  useEffect(() => {
    if (open) {
      console.log("Resetting form");

      if (!userId) {
        const message = "Error loading profile: User ID not found";
        console.error(message);
        toast.error(message);
        return;
      }

      form.reset({
        name: initialProfile.data?.name ?? "",
        latitude: initialProfile.data?.latitude ?? 32,
        longitude: initialProfile.data?.longitude ?? 104.9,
      });
    }
  }, [form, open, userId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used as a greeting on the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="mt-2 text-lg font-medium">Location</h3>
            <Button type="button" variant="outline" onClick={onGetLocation}>
              <LocateFixed className="h-4 w-4" />
              <span className="ms-2">Use my location</span>
            </Button>
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="104.9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 flex justify-end">
              <Button type="button" onClick={onSubmit}>
                <Save className="h-4 w-4" />
                <span className="ms-2">Update</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
