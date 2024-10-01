import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { HiPlus } from "react-icons/hi";
import Link from "next/link";

interface Options {
  text: string;
  link: string;
}

interface DropdownOptionsProps {
  isLocked: boolean;
  options: Options[];
}

export const DropdownOptions: React.FC<DropdownOptionsProps> = ({
  isLocked,
  options,
}) => {
  return (
    <div className="px-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`${buttonVariants({
            variant: "accent",
          })} w-full flex items-center gap-1`}
        >
          <span>
            <HiPlus className="text-white"/>
          </span>
          {!isLocked && (
            <span className="text-md font-semibold truncate text-white">Crear</span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`w-[231px] ${isLocked && "ml-2.5"}`}>
          {options.map((option, index) => (
            <Link key={index} href={`${option.link}`}>
              <DropdownMenuItem className={`cursor-pointer`}>
                {option.text}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
