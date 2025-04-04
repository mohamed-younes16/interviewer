"use client";

import { useState } from "react";
import AuthForm from "./forms/AuthForm";
import { motion as m } from "motion/react";
import Logo from "./Logo";
import CliComp from "./CliComp";

const AuthComp = () => {
  const [authType, setAuthType] = useState<"login" | "register">("login");
  return (
    <CliComp>
      {" "}
      <m.div
        className="relative   max-w-lg mx-auto mt-6 p-6 rounded-xl bg-gradient-to-b from-[#1A1C20] to-[#08090D]"
        key={authType}
        initial={{
          opacity: 0,
          rotateY: 10,
          x: 50,
        }}
        whileInView={{
          opacity: 1,
          rotateY: 0,
          x: 0,
        }}
        transition={{
          bounce: 0.5,
          duration: 0.3,
        }}
      >
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="absolute   -z-10 rounded-xl
      size-[calc(100%_+2px)] top-[-1px] left-[-1px]  bg-gradient-to-b from-[#66686b] to-[#4b4d4f43]  "
        ></m.div>
        <div className="fc flex-col mb-6 ">
          <Logo />
          <p className="font-bold text-2xl">Practice job interviews with AI</p>
        </div>
        <>
          <AuthForm type={authType} />
        </>

        <div className="fc mt-4  font-medium gap-2">
          <p>
            hello to prepwise.
            {authType == "register"
              ? " find your account"
              : "create an account"}
            !
          </p>
          <div
            className="text-main   cursor-pointer "
            onClick={() =>
              setAuthType(authType == "login" ? "register" : "login")
            }
          >
            {authType == "login" ? "register" : "login"}
          </div>
        </div>
      </m.div>
    </CliComp>
  );
};

export default AuthComp;
