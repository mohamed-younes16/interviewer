"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { ProfileEditFormSkeleton } from "./ProfileSkeleton";
import { useStore } from "@/lib/state";
import { UserData } from "@/types";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

// Updated form schema to accept a resume file URL
const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  imageUrl: z
    .string()
    .url({ message: "Please enter a valid URL for your profile image." })
    .optional()
    .or(z.literal("")),
  resume: z
    .string()
    .url({ message: "Please enter a valid URL for your resume file." })
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileEditForm() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      imageUrl: "",
      resume: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;

            form.reset({
              username: userData.username || "",
              imageUrl: userData.imageUrl || "",
              resume: userData.resume || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load your profile data. Please try again.");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [form, router]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;

    try {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      const editData = {
        username: data.username,
        imageUrl: data.imageUrl,
        resume: data.resume,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(userDocRef, editData);
      window.location.reload();
      toast.info("Profile Updated Your profile has been updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && !form.formState.isDirty) {
    return <ProfileEditFormSkeleton />;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center flex-wrap space-y-2 space-x-4">
              <FormLabel className="w-full">profile image :</FormLabel>

              <Avatar className="h-20 w-20">
                <AvatarImage
                  className="object-cover"
                  src={form.watch("imageUrl") || "/profile.svg"}
                  alt="Profile"
                />
                <AvatarFallback>
                  <Image
                    src="/profile.svg"
                    width={20}
                    height={20}
                    alt="profile image"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <UploadButton
                  appearance={{
                    allowedContent: "text-red-600 hidden",
                    button: "bg-purple-800! ",
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
        
                    form.setValue("imageUrl", res[0].ufsUrl, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                    toast.success("Profile image uploaded!");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed! ${error.message}`);
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <div className="flex  gap-2">
                      <UploadButton
                        appearance={{
                          allowedContent: "text-red-600 hidden",
                          button: "bg-purple-800!",
                        }}
                        endpoint="pdfUploader"
                        onClientUploadComplete={(res) => {
          
                          form.setValue("resume", res[0].ufsUrl, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          toast.success("Resume uploaded successfully!");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed! ${error.message}`);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a PDF file as your resume.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex mt-6 justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !form.formState.isDirty ||
                form.formState.isSubmitSuccessful
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
