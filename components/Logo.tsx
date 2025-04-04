import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="fc gap-1 w-fit">
      <Image src={"/logo.svg"} width={50} height={50} alt="logo" />
      <p className="font-bold text-2xl text-[#DDDFFF]">PrepWise</p>
    </Link>
  );
};

export default Logo;
