"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion as m } from "framer-motion";
import axios, { AxiosResponse } from "axios";
import { useStore } from "@/lib/state";
import { Button } from "@/components/ui/button";
import { Interview } from "@/types";
import { dummyInterviews } from "@/constants";

const Page = () => {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const check = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await axios.get("/api/admin/upload", {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(res.data.message);
        setIsAdmin(true);
      } catch (err: unknown) {
        router.push("/");
        setIsAdmin(false);
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || "Unauthorized");
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user, router]);
  const pushdocs = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const data: { token: string; data: Interview[] } = {
        token,
        data: dummyInterviews,
      };
      const res: AxiosResponse = await axios.post("/api/admin/upload", {
        ...data,
      });
      toast.success(res.data.message);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Unauthorized");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {loading && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fc inset-0 fixed z-[9999] backdrop-blur-lg"
        >
          <m.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.7 }}
          >
            <Loader2 className="animate-spin size-16" />
          </m.div>
        </m.div>
      )}
      <div className="fc pt-14">
        {isAdmin && (
          <Button
            onClick={() => {
              pushdocs();
            }}
          >
            Add docs{" "}
          </Button>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Page;
