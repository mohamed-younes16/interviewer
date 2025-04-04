"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/");
      } else {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checking)
    return (
      <div className="fixed inset-0 fc z-50">
        <Loader2 className="size-10 animate-spin " />
        <span className="sr-only">Checking authentication...</span>
      </div>
    );

  return <>{children}</>;
};

export default AuthLayout;
