"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useStore } from "@/lib/state";
import { toast } from "sonner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserData } from "@/types";

const AuthProvider = () => {
  const { setUser, setUserData } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toast.dismiss();

    const unsub = auth.onAuthStateChanged(async (user) => {
      console.log(user);
      setUser(user);
      setLoading(false);

      if (!user) {
        if (pathname !== "/sign-in" && pathname !== "/reset") {
          router.push("/sign-in");
        }
        return;
      }

      const userData = await getDoc(doc(db, "users", user.uid));

      setUserData(userData.data() as UserData);
      if (!userData.exists()) {
        toast.info("Registering user account...");

        await setDoc(doc(db, "users", user.uid), {});
        setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
          imageUrl: user.photoURL,
          resume: "",
          createdAt: new Date().toISOString(),
        })
          .then(() => {
            toast.dismiss();
            toast.success("Registered successfully , now you can login!");
          })
          .catch(() => {
            toast.dismiss();
            toast.error("Error adding user account: ");
          });
      }
      if (!!user && pathname === "/") {
        router.push("/");
      }
    });

    return () => unsub();
  }, [setUser, router, pathname, setUserData]);

  if (loading) return null;

  return null;
};

export default AuthProvider;
