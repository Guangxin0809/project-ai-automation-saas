import Link from "next/link";
import Image from "next/image";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-center items-center gap-y-6 min-h-svh p-6 md:p-10">
    <div className="flex flex-col gap-y-6 w-full max-w-sm">
      <Link href="/" className="flex items-center gap-x-2 self-center font-medium">
        <Image
          src="/logo.svg"
          alt="Nodebase"
          width={30}
          height={30}
        />

        Nodebase
      </Link>

      {children}
    </div>
  </div>
);
