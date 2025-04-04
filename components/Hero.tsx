"use client";
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion as m } from "motion/react";
const Hero = () => {
  return (
    <div className="bg-gradient-to-b mx-auto h-[350px] max-w-[1200px]  px-16 max-lg:px-6 fc from-[#171532] to-[#08090D] rounded-xl">
      <div className=" max-lg:w-2/3 h-full pt-16  flex-col items-start">
        <m.p
          initial={{
            filter: "blur(10px)",
            opacity: 0.5,
            x: -20,
          }}
          whileInView={{ filter: "blur(0px)", x: 0, opacity: 1 }}
          transition={{
            duration: 0.5,

            type: "spring",
            bounce: 0.5,
          }}
          viewport={{ once: true }}
          className="font-semibold  text-[32px]"
        >
          Get Interview-Ready with AI- <br />
        </m.p>
        <m.p
          initial={{
            filter: "blur(10px)",
            opacity: 0.5,
            x: -20,
          }}
          whileInView={{ filter: "blur(0px)", x: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,

            type: "spring",
            bounce: 0.5,
          }}
          viewport={{ once: true }}
          className="font-semibold  text-[32px]"
        >
          Powered Practice & Feedback
        </m.p>
        <m.p
          initial={{
            filter: "blur(10px)",
            opacity: 0.5,
            x: -20,
          }}
          whileInView={{ filter: "blur(0px)", x: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 1,

            type: "spring",
            bounce: 0.5,
          }}
          viewport={{ once: true }}
          className="text-main text-[18px] font-normal mt-[12px] mb-[24px] "
        >
          Practice real interview questions & get instant feedback.
        </m.p>
        <m.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 1.5,
            scale: {
              type: "spring",
              visualDuration: 0.3,
              bounce: 0.2,
              delay: 1.5,
            },
          }}
        >
          {" "}
          <Button className="rounded-full px-8 py-6 bg-main text-xl font-semibold">
            {" "}
            Start an interview
          </Button>
        </m.div>
      </div>

      <div className="flex-1  max-lg:w-1/3 flex items-end h-full relative">
        <div className="w-full relative h-[80%]">
          {" "}
          <m.div
            animate={{ y: [10, 0, 10], scale: 1 }}
            initial={{ scale: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              scale: {
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.5,
                delay: 0.8,
              },
            }}
            className="absolute z-10 size-[50px] top-[20%] right-[20%]  "
          >
            <Image
              alt="tech image"
              src={"/php.png"}
              quality={100}
              className="object-contain"
              fill
            />
          </m.div>
          <m.div
            whileInView={{ y: [10, 0, 10], scale: 1 }}
            initial={{ scale: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              scale: {
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.5,
                delay: 1,
              },
            }}
            className="absolute z-10 size-[50px] top-[20%] left-[20%]  "
          >
            <Image
              alt="tech image"
              src={"/css.png"}
              quality={100}
              className="object-contain"
              fill
            />
          </m.div>
          <m.div
            whileInView={{ y: [10, 0, 10], scale: 1 }}
            initial={{ scale: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              scale: {
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.5,
              },
            }}
            className="absolute z-10 size-[50px] bottom-[10%] left-[20%]  "
          >
            <Image
              alt="tech image"
              src={"/html.png"}
              quality={100}
              className="object-contain"
              fill
            />
          </m.div>
          <m.div
            whileInView={{ y: [10, 0, 10], scale: 1 }}
            initial={{ scale: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
              scale: {
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.5,
                delay: 0.5,
              },
            }}
            className="absolute z-10 size-[50px] bottom-[20%] right-[20%]  "
          >
            <Image
              alt="tech image"
              src={"/js.png"}
              quality={100}
              className="object-contain"
              fill
            />
          </m.div>
          <Image alt="" src={"/robot.png"} className="object-contain " fill />
        </div>
      </div>
    </div>
  );
};

export default Hero;
