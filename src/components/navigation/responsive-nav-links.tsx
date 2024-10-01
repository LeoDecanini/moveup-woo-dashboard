/* React */
import React, { useState } from "react";

/* Shadcn */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "../ui/button";
/* import { Separator } from "@/components/ui/separator"; */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* Shadcn Custom */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet-custom";

/* react-icons */
import { FaBarsStaggered, FaXmark, FaCaretRight } from "react-icons/fa6";

import SubMenu from "./sub-menu";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

interface MenuItem {
  label: string;
  submenu?: string;
  href?: string;
}

interface Open {
  mainModal: boolean;
  subMenu: null | string;
  subMenuLabel: string;
}

const ResponsiveNavLinks: React.FC = () => {
  const [open, setOpen] = useState<Open>({
    mainModal: false,
    subMenu: null,
    subMenuLabel: "",
  });

  const menuItems: MenuItem[] = [
    { label: "Tablero", href: "/" },
    { label: "Portafolio", submenu: "portfolio" },
    { label: "Inquilinos", href: "/tenants" },
    { label: "Mis arrendamientos", submenu: "contact" },
    { label: "Reportes", submenu: "reports" },
  ];

  const buttonLink = [
    { name: "Crear Propiedad", link: "/create-property" },
    { name: "Crear Proyecto", link: "/create-project" },
    { name: "Crear Rol", link: "/settings/roles" },
    { name: "Invitar miembro", link: "/team-management" },
    { name: "Invitar inquilino", link: "/tenants" },
    { name: "Crear contrato", link: "/leases" },
  ];

  const handleSubMenuClick = (submenu: string, label: string) => {
    setOpen({
      ...open,
      subMenu: submenu,
      subMenuLabel: label,
    });
  };

  const handleCloseModal = () => {
    setOpen({
      ...open,
      mainModal: false,
    });
  };

  const getFirstLetter = (name?: string): string => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <Sheet
      onOpenChange={(e) => {
        setOpen({
          ...open,
          mainModal: e,
          subMenu: null,
        });
      }}
      open={open.mainModal}
    >
      <SheetTrigger className="">
        <FaBarsStaggered className="w-[20px] h-[20px] " />
      </SheetTrigger>
      <SheetContent
        className="!w-[90%] overflow-y-auto max-h-screen dark:bg-secondary"
        side={"left"}
      >
        <SubMenu setOpen={setOpen} open={open} />
        <SheetHeader className="relative">
          <SheetTitle className="flex justify-between items-center border-b dark:border-white/50 pb-3">
            <Link className="block dark:hidden" href={"/"}>
              <img
                src="/logos/logo-easyprop-original.png"
                alt="logo-easyprop-original.png"
                className="h-10"
              />
            </Link>
            <Link className="dark:block hidden" href={"/"}>
              <img
                src="/logos/logo-easyprop-original-darck.png"
                alt="logo-easyprop-original.png"
                className="h-10"
              />
            </Link>
            <Button
              onClick={handleCloseModal}
              className="dark:border-white/50 dark:bg-transparent dark:hover:text-black dark:hover:bg-white"
              variant="outline"
              size="icon"
            >
              <FaXmark />
            </Button>
          </SheetTitle>
          <SheetDescription className="pt-3 flex flex-col gap-5">
            <div className="hidden max-[1024px]:block">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="!no-underline bg-primary p-2 rounded">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center h-14 w-14 bg-white font-bold text-xl rounded-full">
                          {getFirstLetter("Leonardo")}
                        </div>
                        <div>
                          <p className="text-white text-lg truncate max-[332px]:max-w-[140px]">
                            Leonardo Decanini
                          </p>
                          <p className="text-white truncate max-[332px]:max-w-[140px]">
                            leodede04@gmil.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2 py-2">
                    <Link
                      href={"/settings"}
                      className={`w-full flex justify-between items-center ${buttonVariants(
                        { variant: "outline" }
                      )}`}
                    >
                      <span>Configuración</span>
                      <FaCaretRight />
                    </Link>
                    <Link
                      href={"/team-management"}
                      className={`w-full flex justify-between items-center ${buttonVariants(
                        { variant: "outline" }
                      )}`}
                    >
                      <span>Gestión de equipos</span>
                      <FaCaretRight />
                    </Link>
                    {/* <button
                      onClick={() => logout()}
                      className={`w-full flex justify-between items-center border-red-600 text-red-600 hover:text-red-600 hover:bg-red-100 ${buttonVariants(
                        { variant: "outline" }
                      )}`}
                    >
                      <span>Cerrar sesion</span>
                      <FaCaretRight />
                    </button> */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`${buttonVariants({
                  variant: "default",
                })} !text-white flex justify-center items-center gap-3`}
              >
                <span>Crear nuevo</span> <FaPlus />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[350px] max-[425px]:w-[333px] max-[375px]:w-[280px] max-[320px]:w-[230px] dark:bg-secondary dark:border-white/50">
                <DropdownMenuLabel>Crear...</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-white/50" />
                {buttonLink.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="cursor-pointer dark:hover:bg-[#012323]"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/**<AccordionTutorial />*/}

            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.submenu ? (
                  <Button
                    variant={"outline"}
                    className="w-full flex justify-between items-center dark:border-white/50 dark:bg-transparent dark:text-white dark:hover:bg-[#012323]"
                    onClick={() =>
                      item.submenu &&
                      handleSubMenuClick(item.submenu, item.label)
                    }
                  >
                    <span>{item.label}</span>
                    <FaCaretRight />
                  </Button>
                ) : (
                  <Link
                    onClick={handleCloseModal}
                    href={item.href as string}
                    className={`w-full flex justify-between items-center dark:border-white/50 dark:bg-transparent dark:text-white dark:hover:bg-[#012323] ${buttonVariants(
                      { variant: "outline" }
                    )}`}
                  >
                    <span>{item.label}</span>
                    <FaCaretRight />
                  </Link>
                )}
              </React.Fragment>
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ResponsiveNavLinks;
