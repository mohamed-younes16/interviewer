"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db, googleAuthProvider } from "@/lib/firebase";
import LoginButton from "../LoginButton";
import { FcGoogle } from "react-icons/fc";
import { doc, setDoc } from "firebase/firestore";
import { UploadButton } from "@/lib/uploadthing";
import { CheckCircle, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema
  .extend({
    username: z.string().min(4),
    confirmPassword: z.string().min(6),
    resume: z.string().optional(),
    imageUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const AuthForm = ({
  type,
  setAuthType,
}: {
  type: "login" | "register";
  setAuthType: (v: "login" | "register") => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema | typeof loginSchema>>({
    defaultValues:
      type === "register"
        ? { username: "", email: "", password: "", confirmPassword: "" }
        : { email: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(type === "register" ? registerSchema : loginSchema),
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (
    data: z.infer<typeof registerSchema | typeof loginSchema>
  ) => {
    try {
      if (type === "register") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;

        if ("username" in data) {
          setDoc(doc(db, "users", user.uid), {
            username: data.username,
            email: data.email,
            imageUrl: data.imageUrl,
            resume: data.resume,
            createdAt: new Date().toISOString(),
          })
            .then(() =>
              toast.success("Registered successfully , now you can login!")
            )
            .catch((error: any) => {
              toast.error("Error adding user account: ");
            });
        }
      } else if (type === "login") {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === "register" && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {type === "register" && (
          <>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="flex  gap-2">
                        {form.watch("imageUrl") ? (
                          <>
                            <Avatar className="h-20 relative w-20">
                              <div
                                onClick={() => {
                                  form.setValue("imageUrl", "", {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  });
                                }}
                                className="absolute opacity-0 inset-0 z-50 rounded-full transition-all cursor-pointer hover:opacity-40 bg-red-600 fc"
                              >
                                <X strokeWidth={3} className="size-6" />
                              </div>
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
                            <div className="text-green-600 fc gap-2 font-bold">
                              Image uploded
                              <CheckCircle />
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UploadButton
                              appearance={{
                                allowedContent: "text-red-600 hidden",
                                button: "bg-purple-800!",
                              }}
                              content={{
                                button({ ready, isUploading }) {
                                  if (ready && !isUploading)
                                    return <div>Upload image</div>;
                                  if (isUploading || !ready)
                                    return (
                                      <Loader2 className="animate-spin size-8 z-50 " />
                                    );
                                },
                              }}
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                form.setValue("imageUrl", res[0].ufsUrl, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                });
                                toast.success("image uploaded successfully!");
                              }}
                              onUploadError={(error: Error) => {
                                toast.error(`Upload failed! ${error.message}`);
                              }}
                            />
                            <FormDescription>
                              Upload a PDF file as your resume.
                            </FormDescription>
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume (PDF)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="flex  gap-2">
                        {form.watch("resume") ? (
                          <div className="text-green-600 fc gap-2 font-bold">
                            file uploded
                            <CheckCircle />
                          </div>
                        ) : (
                          <>
                            <UploadButton
                              appearance={{
                                allowedContent: "text-red-600 hidden",
                                button: "bg-purple-800!",
                              }}
                              content={{
                                button({ ready, isUploading }) {
                                  if (ready && !isUploading)
                                    return <div>Upload PDF</div>;
                                  if (isUploading || !ready)
                                    return (
                                      <Loader2 className="animate-spin size-8 z-50 " />
                                    );
                                },
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
                            />{" "}
                            <FormDescription>
                              Upload a PDF file as your resume.
                            </FormDescription>
                          </>
                        )}
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
        <Button disabled={!isValid} type="submit" className="w-full">
          {type === "register" ? "Register" : "Login"}
        </Button>
        <LoginButton
          icon={<FcGoogle className="size-6" />}
          label="sign in with google"
          onClick={() => signInWithPopup(auth, googleAuthProvider)}
        />
        <p
          className="text-sm w-fit mx-auto text-center text-blue-500 cursor-pointer"
          onClick={() => router.push("/reset")}
        >
          Forgot Password?
        </p>
      </form>
    </Form>
  );
};

export default AuthForm;
