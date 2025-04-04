import React from "react";
import { Button } from "./ui/button";

const LoginButton = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Button
      size={"sm"}
      onClick={onClick}
      className=" hover:opacity-80 active:scale-[99%] bg-accent text-foreground transition-all w-full flexcenter py-6 "
    >
      {icon}
      <p className="flex-1 ">{label}</p>
    </Button>
  );
};

export default LoginButton;
