import InterviewLive from "@/components/InterviewLive";
import Loading from "@/components/Loading";
import { db } from "@/lib/firebase";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";

import Image from "next/image";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let interview: Interview | null = null;

  try {
    const docSnapshot = await getDoc(doc(db, "templates", id));
    if (docSnapshot.exists()) {
      interview = docSnapshot.data() as Interview;
    }
  } catch (error) {
    console.log(error);
  }

  if (!interview) {
    return (
      <Loading/>
    );
  }

  const techstack: string[] = interview.techstack
    .slice(0, 2)
    .map((e) => e.toLowerCase().replace(/[\s+-]/g, ""));

  return (
    <div className="pt-6 space-y-10 px-16">
      <div className="flex justify-between">
        {interview !== null ? <>
         <div className="fc gap-3">
          <Image
            src={interview.imageUrl}
            width={40}
            height={40}
            className="rounded-full size-[40px]"
            alt="Interview Image"
          />
          <p className="text-3xl font-semibold">{interview.role}</p>
          <div className="flex items-center">
            {techstack.map((tech, i) => (
              <div
                key={i}
                style={{ marginLeft: i !== 0 ? "-10px" : 0 }}
                className="rounded-full fc size-[40px] border-[#242633] bg-[#1A1C2A] border-[1px]"
              >
                <Image
                  src={"/react.svg"}
                  alt={tech}
                  width={30}
                  height={30}
                  className="object-contain size-6"
                />
              </div>
            ))}
          </div>
        </div>
        </>:null}
       
        <div className="fc text-xl rounded-lg px-4 py-3 bg-[#24273A]">
          {interview.type} Interview
        </div>
      </div>
      <InterviewLive type="interview" data={interview} />
    </div>
  );
};
export default page;
