"use client";

import { Feedback, Interview } from "@/types";
import { CalendarCheck, StarsIcon } from "lucide-react";
import { motion as m } from "motion/react";
import Image from "next/image";
import { parse } from "date-fns";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
const InterviewCard = ({
  mode,
  data,
  delay = 0,
}:
  | {
      mode: "template";
      data: Interview;
      delay?: number;
    }
  | {
      mode: "feedback";
      data: Feedback;
      delay?: number;
    }) => {
  const techstack: string[] = (
    mode === "template" ? data.techstack : data.template.techstack
  )
    .slice(0, 2)
    .map((e) => e.toLowerCase().replace(/[\s+-]/g, ""));

  return (
    <div className="bg-grad px-4 min-h-[400px]  py-6 w-[320px] space-y-5 rounded-xl relative ">
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay * 0.2 }}
        className="absolute  -z-10 rounded-xl
      size-[calc(100%_+2px)] top-[-1px] left-[-1px]  bg-gradient-to-b from-[#66686b] to-[#4b4d4f43]  "
      ></m.div>
      <div className="absolute top-0 right-0 px-4 rounded-tr-xl h-7 bg-[#24273A] rounded-bl-sm  ">
        {mode === "feedback" ? data.template.type : data.type}
      </div>
      <Image
        src={mode === "feedback" ? data.template.imageUrl : data.imageUrl}
        // src={"/covers/hostinger.png"}
        alt="logo for interview"
        height={70}
        width={70}
        className="rounded-full object-contain "
      />

      <p className="text-2xl font-semibold">
        {mode === "feedback" ? data.template.role : data.role}
      </p>
      {mode === "feedback" && (
        <div className="flex gap-4 text-main">
          <div className="dc gap-2">
            <CalendarCheck />
            <p>
              {parse(data.createdAt, "MMM dd, yyyy", new Date()).toString()}
            </p>
          </div>
          <div className="dc gap-2">
            <StarsIcon />
            <p>{data.totalScore} / 100 </p>
          </div>
        </div>
      )}
      <p className="line-clamp-3 h-20 text-[16px]">
        {mode === "feedback" ? data.finalAssessment : data.description}
      </p>

      <Separator className="mt-14" />
      <div className="flex justify-between items-center">
        <div className="flex ">
          {techstack.slice(2).map((tech, i) => (
            
              <div
                key={i}
                style={{ marginLeft: i !== 0 ? "-10px" : 0 }}
                className="rounded-full fc size-[40px] border-[#242633] bg-[#1A1C2A] border-[1px] "
              >
                <Image
                  src={`/${techstack[i]}.png`}
                  alt={tech}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
            
          ))}
        </div>
        <Link
          href={
            mode === "template"
              ? `/interview/${data.id}`
              : `feedback/${data.id}`
          }
        >
          <Button className="bg-main text-sm px-6 rounded-full !h-[40px] text-black font-semibold ">
            Take Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
