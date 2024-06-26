"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      return true;
    }
    return false;
  };
  return (
    <div className="sm:hidden ">
      <Menu
        onClick={toggleOpen}
        className="realtive z-index-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolue bg-white border- b border-zinc-200 shadown-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-up")}
                    className="flex items-center w-full font-semibold text-green-600"
                    href="/sign-up"
                  >
                    Get Started <ArrowRight className="ml-2 h05 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300 " />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-in")}
                    className="flex items-center w-full font-semibold "
                    href="/sign-in"
                  >
                    Sign in 
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300 " />
               
                <li>
                  <Link
                    onClick={() => closeOnCurrent("//pricing")}
                    className="flex items-center w-full font-semibold "
                    href="pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
              <li>
              <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex items-center w-full font-semibold "
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300 " />
                <li className="my-3 h-px w-full bg-gray-300 " />
                <li>
                  <Link
                    
                    className="flex items-center w-full font-semibold "
                    href="/sign-out"
                  >
                    Sign out
                  </Link>
                  </li></>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
export default MobileNav;
