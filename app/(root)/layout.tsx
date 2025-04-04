import Navbar from "@/components/nav/Navbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="pt-[75px] px-16">{children}</div>
    </>
  );
};

export default layout;
