import React from "react";
import { FaCaretRight } from "react-icons/fa";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

interface MenuItem {
  label: string;
  text: string;
  icon?: JSX.Element;
  href: string;
}

interface SubMenuItem {
  title?: string;
  links: MenuItem[];
}

interface Open {
  mainModal: boolean;
  subMenu: null | string;
  subMenuLabel: string;
}

const SubMenuItems: React.FC<{
  item: SubMenuItem;
  index: number;
  open: Open;
  setOpen: (open: Open) => void;
}> = ({ item, index, open, setOpen }) => {
  return (
    <div
      className={`${index === 2 ? "" : "border-b dark:border-white/50"} pb-5`}
      key={index}
    >
      <span className="text-lg text-secondary dark:text-white">
        {item.title}
      </span>

      {item.links.map((link, linkIndex) => (
        <Link
          href={link.href}
          key={linkIndex}
          className={`w-full mt-2 flex justify-between gap-5 items-center group h-full max-h-16 dark:hover:bg-[#012323] ${buttonVariants(
            { variant: "ghost" }
          )}`}
          onClick={() => {
            setOpen({
              ...open,
              mainModal: false,
            });
            setTimeout(() => {
              setOpen({
                ...open,
                subMenu: null,
                mainModal: false,
              });
            }, 200);
          }}
        >
          {link.icon}
          <div className="text-left w-full">
            <strong className="group-hover:text-secondary dark:group-hover:text-white dark:text-white">
              {link.label}
            </strong>
            <p className="text-black/80 dark:text-white/70 text-xs text-wrap line-clamp-2">
              {link.text}
            </p>
          </div>
          <FaCaretRight className="group-hover:text-secondary dark:group-hover:text-white" />
        </Link>
      ))}
    </div>
  );
};

export default SubMenuItems;
