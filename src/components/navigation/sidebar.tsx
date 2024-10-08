'use client';

/* react */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCaretRight } from 'react-icons/fa';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

/* react icons */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ThemeToggle } from '../site/theme-toggle';
/* shadcn */
import { buttonVariants } from '../ui/button';
import { DropdownOptions } from './dropdown-options';
import { LinksOptions } from './links-options';
import NavBar from './nav-bar';
import { Badge } from '@/components/ui/badge';

const menuOptions = [{ text: 'Productos', link: '/create-product' }];

const Sidebar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isLocked, setLocked] = useState(false);

  const pathname = usePathname();
  console.log(pathname);

  const toggleLock = () => setLocked(!isLocked);

  /*   useEffect(() => {
    // Acceder a window solo en el cliente
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []); */

  return (
    <div>
      {/* <button
      onClick={toggleLock}
      className={`text-xl hidden min-[900px]:block fixed z-50 top-5 bg-secondary transition-all duration-300 rounded-full border border-black/40 ${
        isLocked ? "left-[52px]" : "left-[244px]"
      }
      `}
    >
      {isLocked ? (
        <MdKeyboardDoubleArrowRight className="text-white" />
      ) : (
        <MdKeyboardDoubleArrowLeft className="text-white" />
      )}
    </button> */}

      <nav
        className={`hidden min-[900px]:block fixed top-0 z-40 left-0 h-full bg-secondary transition-all duration-300 ${
          !isLocked ? 'w-64' : 'w-16'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <Link href={'/'}>
            <div className="flex items-center justify-between p-4 pt-6">
              <div className="flex items-center gap-1">
                <img
                  src="/ICONO_MAIN.png"
                  className="h-[25px]"
                  alt="Logo"
                />
                {!isLocked && (
                  <>
                  <img
                    src="/NOMBRE_MAIN.png"
                    className="h-[25px] pt-[2px]"
                    alt="Logo"
                  />
                  <Badge className={"!ml-1"}>v0.1.0</Badge>
                  </>
                )}
              </div>
            </div>
          </Link>

          <div className="flex flex-col flex-grow overflow-y-auto">
            {/* <DropdownOptions options={menuOptions} isLocked={isLocked} /> */}

            <LinksOptions isLocked={isLocked} pathname={pathname ?? ''} />
          </div>

          <div className="flex flex-col gap-2">

            <div className="p-3">
            <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`${buttonVariants({
                    variant: 'ghost',
                  })} !text-white hover:bg-primary/10 flex gap-2 justify-between items-center w-full`}
                >
                  <div className="flex items-center gap-2">
                    <span className="py-2 px-3.5 rounded-full bg-accent/10">
                      L
                    </span>
                    <p className="text-white">Leonardo Decanini</p>
                  </div>
                  <FaCaretRight />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px] mb-3 bg-secondary !text-white border-black/20">
                  <DropdownMenuLabel className="truncate">
                    leodede04@gmail.com
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/20" />
                  <Link href={'/settings'}>
                    <DropdownMenuItem className="cursor-pointer !text-white hover:!bg-primary/10 dark:hover:bg-[#012323]">
                      Configuración
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main
        className={`w-full flex transition-all duration-300 flex-col items-center justify-center h-screen bg-secondary  ${
          !isLocked ? 'min-[900px]:pl-64' : 'min-[900px]:pl-16'
        }
      `}
      >
        <div
          className={`w-full h-full transition-all duration-300 p-6 pl-2 flex flex-col items-center justify-center`}
        >
          {/* <NavBar /> */}

          <div className="transition-all duration-300 overflow-hidden h-svh bg-white shadow-xl dark:bg-black w-full rounded-2xl">
            <div className="pt-5 transition-all duration-300 overflow-auto h-full bg-white shadow-xl dark:bg-black w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
