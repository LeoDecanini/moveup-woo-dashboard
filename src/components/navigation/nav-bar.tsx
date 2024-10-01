"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaCaretDown } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import ResponsiveNavLinks from "../navigation/responsive-nav-links";
import Link from "next/link";

const NavBar = () => {
  const [open2, setOpen2] = useState(false);

  const handleDropdownToggle = () => {
    if (open2) {
      setOpen2(false);
    } else {
      setOpen2(true);
    }
  };

  return (
    <section className={`w-full fixed right-0 z-30 bg-[#FAFAFA]`}>
      <div className="flex justify-between min-[900px]:justify-end gap-2 items-center bg-[#FAFAFA] p-3">
        <div className="flex items-center gap-4 min-[900px]:hidden">
          <ResponsiveNavLinks />

          <img
            src="/logos/logo-ezyprop-icon.png"
            className="sm:hidden w-[31px] h-[31px]"
            alt="Logo"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="bg-transparent hidden sm:block border-accent hover:text-accent text-accent hover:bg-accent/10"
          >
            Invitar usuario
          </Button>

          <DropdownMenu open={open2} onOpenChange={handleDropdownToggle}>
            <DropdownMenuTrigger
              className={`${buttonVariants({
                variant: "ghost",
              })} hover:bg-transparent !text-black flex gap-2 items-center`}
            >
              <span className="py-2 px-3.5 rounded-full bg-accent/10">L</span>
              <FaCaretDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3">
              <DropdownMenuLabel className="truncate">
                leodede04@gmail.com
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/settings"}>
                <DropdownMenuItem className="cursor-pointer dark:hover:bg-[#012323]">
                  Configuración
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
};

export default NavBar;
