"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logo from "../Logo";
import { useStore } from "@/lib/state";
import Image from "next/image";
import { Edit, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const Navbar = () => {
  const { userData: user } = useStore();

  return (
    <div className="fixed z-50 top-0 w-full border-b-accent-foreground/30 border-[1px] items-center flex justify-between px-16  left-0 h-[75px] backdrop-blur-md rounded-b-2xl">
      <Logo />
      <Popover>
        <PopoverTrigger
          className="rounded-full cursor-pointer border-accent-foreground/50 
        border-[2px] overflow-hidden size-12 fc transition-all hover:shadow-accent hover:shadow-xl"
        >
          <Avatar className="size-12 ">
            <AvatarImage
              className="object-cover"
              src={user?.imageUrl || "/profile.svg"}
              alt="Profile"
            />
            <AvatarFallback>
              <Image
                src="/profile.svg"
                width={20}
                height={20}
                alt="profile image"
              />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="space-y-1">
          <Link href={`/profile`} className="flex">
            {" "}
            <Button
              variant={"ghost"}
              className="flex w-full gap-3 justify-start items-center px-4 py-2"
            >
              {" "}
              <Edit strokeWidth={3} className="h-6 w-6 " />
              <p className=" font-bold text-">profile</p>
            </Button>{" "}
          </Link>
          <Separator className="w-full " />
          <Button
            onClick={async () => {
              toast.loading("signing out");
              await signOut(auth);
              window.location.href = "/sign-in";
            }}
            variant={"ghost"}
            className="flex w-full text-red-500 gap-3 justify-start items-center px-4 py-2"
          >
            <LogOut strokeWidth={3} className="h-6 w-6 " />
            <p className=" font-bold text-">Logout</p>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Navbar;
