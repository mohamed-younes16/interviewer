"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Loading from "@/components/Loading";

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

  if (checking) return <Loading />;

  return <>{children}</>;
};

export default AuthLayout;
