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
import { useRouter } from "next/navigation";

const ProfileSchema = z.object({
  name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  calendarURL: z.string().optional(),
});
type Profile = z.infer<typeof ProfileSchema>;

export type ProfileFull = {
  userId: string | null;
  initialised: boolean | null;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  calendarURL: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export function UpdateProfile({
  open,
  initialProfile,
  onClose,
}: {
  open: boolean;
  initialProfile: ProfileFull | null | undefined;
  onClose: () => void;
}) {
  const { userId } = useAuth();
  const router = useRouter();

  const utils = api.useUtils();

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.profile.invalidate();
      toast.success("Profile updated successfully");
      console.log("Profile updated successfully");
      onClose();
      setTimeout(() => {
        router.refresh();
      }, 400);
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
      calendarURL: "",
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
      calendarURL: form.getValues("calendarURL"),
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
      calendarURL: data.calendarURL,
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
        name: initialProfile?.name ?? "",
        latitude: initialProfile?.latitude ?? 32,
        longitude: initialProfile?.longitude ?? 104.9,
        calendarURL: initialProfile?.calendarURL ?? "",
      });
    }
  }, [form, open, initialProfile, userId]);

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
                  <FormLabel>Name (Optional)</FormLabel>
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
            <h3 className="mt-2 text-lg font-medium">Location (Optional)</h3>
            <Button type="button" variant="outline" onClick={onGetLocation}>
              <LocateFixed className="h-4 w-4" />
              <span className="ms-1">Use my location</span>
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
            <h3 className="mt-2 text-lg font-medium">Calendar (Optional)</h3>
            <FormField
              control={form.control}
              name="calendarURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is an ICS URL. You can find this by going to your
                    calendar provider and finding the &quot;Share Calendar&quot;
                    option.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 flex justify-end">
              <Button type="button" onClick={onSubmit}>
                <Save className="h-4 w-4" />
                <span className="ms-1">Update</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
