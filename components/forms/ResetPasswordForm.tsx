"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const resetSchema = z.object({
  email: z.string().email().or(z.literal("")),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .or(z.literal("")),
});

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [oobCode, setOobCode] = useState<string>("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [checkingcode, setCheckingCode] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof resetSchema>>({
    defaultValues: {
      email: "",
      newPassword: "",
    },
    mode: "all",
    resolver: zodResolver(resetSchema),
  });

  const {
    formState: { isSubmitting, isValid, isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (!isValidCode && !checkingcode && oobCode?.length > 0) {
      window.history.replaceState(null, "", "/reset");
      setOobCode("");
      setIsValidCode(false);
      form.reset();
    }
  }, [isValidCode, checkingcode, oobCode, form]);

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
      verifyCode(code);
    }
  }, [searchParams]);

  const verifyCode = async (code: string) => {
    try {
      setCheckingCode(true);
      await verifyPasswordResetCode(auth, code);
      setIsValidCode(true);
      toast.success("Reset code verified. You can now reset your password.");
    } catch {
      toast.error("Invalid or expired password reset link.");
      setIsValidCode(false);
      console.error("Error verifying password reset code:");
    } finally {
      setCheckingCode(false);
    }
  };

  const handleSendResetEmail = async (data: { email: string }) => {
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: "http://localhost:3000/reset",
        handleCodeInApp: true,
        dynamicLinkDomain: "http://localhost:3000/reset",
      });
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Error sending reset email: ");
      console.error("Error sending reset email:");
    }
  };

  const handlePasswordReset = async (data: { newPassword: string }) => {
    if (!oobCode) {
      toast.error("No reset code found.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, data.newPassword);
      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch {
      toast.error("Error resetting password ");
      console.error("Error confirming password reset");
    }
  };

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    if (oobCode && isValidCode) {
      // Handle password reset
      await handlePasswordReset({ newPassword: data.newPassword! });
    } else {
      // Handle sending reset email
      await handleSendResetEmail({ email: data.email! });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!oobCode ? (
          // Email input for sending reset email
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : isValidCode ? (
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green-500">New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <div className="fc text-red-500">invalid or expired reset code</div>
        )}
        {checkingcode && (
          <div className="fc gap-2">
            <Loader2 className="animate-spin" />
            verifying reset code...
          </div>
        )}
        {isValidCode || checkingcode || !oobCode ? (
          <Button
            disabled={
              !isValid ||
              isSubmitting ||
              (isSubmitSuccessful && !oobCode) ||
              (form.watch().newPassword.length == 0 && !!oobCode)
            }
            type="submit"
            className="w-full"
          >
            {!oobCode ? "Send Reset Email" : "Reset Password"}
          </Button>
        ) : (
          <Button
            disabled={!isValid || isSubmitting}
            type="button"
            className="w-full"
          >
            ReSend Reset Email
          </Button>
        )}
        <p
          className="text-base w-fit mx-auto text-center text-main font-bold cursor-pointer"
          onClick={() => router.push("/sign-in")}
        >
          back to sign in
        </p>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
