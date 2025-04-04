"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import InterviewCard from "@/components/InterviewCard";
import Loading from "@/components/Loading";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Interview } from "@/types";

export default function Home() {
  const [user, setUser] = useState(auth.currentUser);
  const [interviews, setInterviews] = useState<Interview[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  useEffect(() => {
    if (user) {
      const fetchInterviews = async () => {
        const querySnapshot = await getDocs(collection(db, "templates"));
        setInterviews(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Interview[]
        );
        setLoading(false);
      };

      fetchInterviews();
    } else {
      setLoading(false);
    }
  }, [user]);
  console.log(interviews !== null);
  if (loading) return <Loading />;

  return (
    <div className="pt-6 px-16">
      {user ? (
        <>
          <Hero />
          <div className="flex max-w-[1200px] mx-auto mt-6 gap-6 flex-wrap">
            {interviews !== null
              ? interviews.map((e, i) => (
                  <InterviewCard data={e} key={i} delay={i} mode="template" />
                ))
              : null}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
