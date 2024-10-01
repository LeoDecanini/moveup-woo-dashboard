"use client";

import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";

import { MdDashboardCustomize, MdOutlineProductionQuantityLimits } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-custom";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { IoIosContacts } from "react-icons/io";
import Link from "next/link";

interface LinkSubItem {
  title: string;
  href: string;
}

interface LinkItem {
  href: string;
  icon: React.ElementType;
  text: string;
  links?: LinkSubItem[];
  accordion: boolean;
}

interface LinkGroup {
  group: string;
  items: LinkItem[];
}

interface LinksOptionsProps {
  isLocked: boolean;
  pathname: any;
}

const links: LinkGroup[] = [
  {
    group: "Panel de Control",
    items: [
      {
        href: "/",
        icon: MdDashboardCustomize,
        text: "Dashboard",
        accordion: false,
      },
    ],
  },
  {
    group: "Administracion",
    items: [
      {
        href: "/products",
        icon: MdOutlineProductionQuantityLimits,
        text: "Productos",
        links: [
          {
            title: "Crear producto",
            href: "/products/create",
          },
        ],
        accordion: true,
      },
    ],
  },
  {
    group: "Administracion",
    items: [
      {
        href: "/blog",
        icon: MdOutlineProductionQuantityLimits,
        text: "Blogs",
        links: [
          {
            title: "Crear publicacion",
            href: "/blog/create",
          },
        ],
        accordion: true,
      },
    ],
  },
];

export const LinksOptions: React.FC<LinksOptionsProps> = ({
  isLocked,
  pathname,
}) => {
  const [open, setopen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col gap-2 pt-4">
      {links.map(({ group, items }) => (
        <div className="flex-col gap-2 flex" key={group}>
          {/* {group !== "Panel de Control" && (
            <div key={group} className="flex-col gap-2 flex">
              <div className="h-[1px] w-full bg-black/30 rounded-full"></div>
            </div>
          )} */}

          {/* {!isLocked && (
            <div className="pt-1 pl-2 line-clamp-1" key={group}>
              <h3 className="text-sm">{group}</h3>
            </div>
          )} */}
          <div className="px-3 w-full flex-col gap-2 flex">
            {items.map(({ href, icon: Icon, text, accordion, links }) => (
              <React.Fragment key={href}>
                {isLocked ? (
                  <>
                    {accordion ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            asChild
                          >
                            <div>
                              <DropdownMenu
                                open={open}
                                onOpenChange={() => setopen(!open)}
                              >
                                <DropdownMenuTrigger
                                  className={`${buttonVariants({
                                    variant: "navLink",
                                  })} ${
                                    pathname === href
                                      ? " text-white font-bold border border-white"
                                      : " text-white"
                                  } !justify-start !p-0 !px-2.5 w-full flex items-center gap-2`}
                                >
                                  <Icon />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  side="right"
                                  className="mt-[170px] w-[200px]"
                                >
                                  <DropdownMenuLabel>
                                    Productos
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />

                                  {links?.map((link, index) => (
                                    <Link href={link.href} key={index}>
                                      <DropdownMenuItem>
                                        {link.title}
                                      </DropdownMenuItem>
                                    </Link>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TooltipTrigger>
                          {!open && isHovered && (
                            <TooltipContent className="bg-accent" side="right">
                              <p className="text-sm">{text}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Link
                                href={href}
                                className={`${buttonVariants({
                                  variant: "navLink",
                                })} ${
                                  pathname === href
                                    ? " text-white font-bold !bg-primary"
                                    : " text-white"
                                } !justify-start !p-0 !px-2.5 w-full flex items-center gap-2`}
                              >
                                <span className="text-lg">
                                  <Icon />
                                </span>
                                {!isLocked && (
                                  <span className="text-md font-semibold">
                                    {text}
                                  </span>
                                )}
                              </Link>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-accent" side="right">
                            <p className="text-sm">{text}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </>
                ) : (
                  <>
                    {accordion ? (
                      <Accordion type="single" collapsible>
                        <AccordionItem
                          value="item-1"
                          className={`${
                            pathname.includes(href) && "!bg-primary rounded-lg"
                          }`}
                        >
                          <AccordionTrigger
                            className={`${buttonVariants({
                              variant: "accordion",
                            })} ${
                              pathname.includes(href) &&
                              "!bg-primary rounded-lg"
                            } text-white/80 hover:text-white !justify-between !p-0 !px-2.5 w-full flex items-center gap-2 !font-medium`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                <Icon />
                              </span>
                              <span className="">{text}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="px-2.5 flex flex-col gap-1 border-l h-full">
                              {links?.map((link, index) => (
                                <Link
                                  className={`${
                                    pathname.includes(link.href)
                                      ? "text-white"
                                      : "text-white/80 hover:text-white"
                                  }`}
                                  href={link.href}
                                  key={index}
                                >
                                  <span>{link.title}</span>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link
                        href={href}
                        className={`${buttonVariants({
                          variant: "navLink",
                        })} ${
                          pathname === href
                            ? "text-white font-bold !bg-primary hover:bg-primary/80"
                            : "hover:text-white text-white/80"
                        } !justify-start !p-0 !px-2.5 w-full flex items-center gap-2`}
                      >
                        <span className="text-lg">
                          <Icon />
                        </span>
                        {!isLocked && (
                          <span className="text-md font-semibold">{text}</span>
                        )}
                      </Link>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
