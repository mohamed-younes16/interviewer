"use client";

import { useStore } from "@/lib/state";
import { Interview } from "@/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { vapi } from "@/lib/vapi";
import { interviewer } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { toast } from "sonner";
const InterviewLive = ({ data }: { data: Interview }) => {
  const [volume, setVolume] = useState<number>(20);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [isSpeaking, setIsspeaking] = useState(false);
  const { userData } = useStore();

  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
      toast.success("call started");
    });
    vapi.on("volume-level", (e) => {
      setVolume(e);
    });
    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
    });
    vapi.on("speech-start", () => {
      setIsspeaking(true);
    });
    vapi.on("speech-end", () => {
      setIsspeaking(false);
    });

    vapi.on("error", (e) => {
      setConnecting(false);
      setConnected(false);
      toast.error("erroe happend with vapi ");
    });

    vapi.on("message", (message) => {
      console.log("Vapi Message:", message);

      try {
        const jsonMessage = JSON.parse(message);

        if (
          jsonMessage?.totalScore !== undefined &&
          jsonMessage?.categoryScores
        ) {
          console.log("Final Feedback JSON:", jsonMessage);
          toast.success("Interview feedback received!");

          // You can store the JSON in state or send it to Firestore.
        }
      } catch (error) {
        console.log("Not a JSON message:", message);
      }
    });
  }, []);

  const startInterview = async () => {
    setConnecting(true);
    const template = {
      ...interviewer,
      model: {
        ...interviewer.model,
        messages: [
          {
            role: "system",
            content: interviewer.model?.messages?.[0]?.content?.replace(
              "{{questions}}",
              JSON.stringify(data.questions)
            ),
          },
        ],
      },
    } as CreateAssistantDTO;

    vapi.start(template);
  };
  const endcall = async () => {
    vapi.stop();
  };
  if (!(userData && data))
    return (
      <div className="fixed inset-0 z-50 fc">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className="space-y-6">
      <div className="fc max-w-5xl gap-5 mx-auto">
        {" "}
        <div
          className={`flex-1 fc ${
            isSpeaking ? "border-main" : "border-[#fef2c547]"
          }  flex-col  from-[#181537]  h-[450px] to-[#0C0B16] rounded-xl   border-[3px] fc space-y-5  bg-gradient-to-b `}
        >
          <div className="size-[200px]  rounded-full  relative fc ">
            <div className="bg-gradient-to-bl size-[120px] from-[#FFFFFF]  to-main z-40 rounded-full fc absolute  ">
              <Image
                src={`/ai-avatar.png`}
                width={75}
                height={75}
                className="size-[75px] object-contain rounded-full"
                alt="your profile image"
              />
            </div>
            {Array.from({ length: 2 }).map((e, i) => {
              const cap = (i + 1) * 50;
              const res = Math.min(cap, volume);

              return (
                <m.div
                  style={{
                    width: res + 120,
                    height: res + 120,
                    zIndex: 20 - (i + 1),
                    opacity: 1 / (i + 1),
                    transitionDelay: `${0.1 * (i + 1)}s`,
                    transitionTimingFunction:
                      "cubic-bezier(0.85, 0.03, 0.26, 1.29)",
                  }}
                  className="absolute  rounded-full transition-all duration-300  bg-main   border-2 "
                ></m.div>
              );
            })}
          </div>

          <p className="fnt-semibold capitilize text-2xl">AI Interviewer</p>
        </div>{" "}
        <div
          className={`flex-1  ${
            !isSpeaking ? "border-main" : "border-[#fef2c547]"
          }    fc flex-col rounded-xl h-[450px]  border-[3px] bg-gradient-to-b from-[#1A1C20] to-[#08090D] space-y-5`}
        >
          <Image
            src={`${userData?.imageUrl}`}
            width={200}
            height={200}
            className="rounded-full object-cover size-[200px]"
            alt="your profile image"
          />
          <p className="fnt-semibold capitilize text-2xl">
            {userData.username} (You)
          </p>{" "}
        </div>
      </div>
      <div className="w-full">
        <div className="fc">
          {" "}
          {connecting ? (
            <Loader2 className="size-10 animate-spin" />
          ) : (
            <Button
              onClick={() => {
                connected ? endcall() : startInterview();
              }}
              size={"lg"}
              disabled={connecting}
              className="bg-main py-6 rounded-full  px-8 font-bold text-2xl"
            >
              {connected ? "end call" : "   Start Interview"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewLive;
