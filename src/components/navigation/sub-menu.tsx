import { SheetDescription, SheetTitle } from "@/components/ui/sheet-custom";

import { FaXmark, FaChevronLeft } from "react-icons/fa6";
import { Button } from "../ui/button";
import SubMenuItems from "./sub-menu-items";

interface Open {
  mainModal: boolean;
  subMenu: null | string;
  subMenuLabel: string;
}

const SubMenu: React.FC<{ open: Open; setOpen: (open: Open) => void }> = ({
  open,
  setOpen,
}) => {
  const subMenuItemsPortfolio = [
    {
      title: "Gestión de Propiedades",
      links: [
        {
          label: "Proyectos",
          text: "Visualiza todas tus proyectos.",
          href: "/portfolio/projects",
        },
        {
          label: "Propiedades",
          text: "Visualiza todas tus propiedades.",
          href: "/portfolio/properties",
        },
      ],
    },
  ];

  const subMenuItemsContact = [
    {
      title: "Recursos para Propietarios de Inmuebles",
      links: [
        {
          label: "Contratos",
          text: "Visualiza todos tus contratos.",
          href: "/leases",
        },
        {
          label: "Incidentes",
          text: "Visualiza todos tus incidentes.",
          href: "/incidents",
        },
      ],
    },
  ];

  const subMenuItemsReports = [
    {
      title: "Reportes",
      links: [
        {
          label: "Prueba",
          text: "Un reporte de prueba",
          href: "/report/test",
        },
      ],
    },
  ];

  return (
    <>
      {(
        <div
          className={`absolute p-6 top-0 left-0 bg-white dark:bg-secondary w-full h-full z-20 transition-transform duration-500 transform ${
            open.subMenu ? "translate-x-0" : "-translate-x-full !duration-200"
          }`}
        >
          <SheetTitle className="flex justify-between items-center border-b dark:border-white/50 pb-3">
            <Button
              onClick={() => {
                setOpen({
                  ...open,
                  subMenu: null,
                });
              }}
              variant="outline"
              size="icon"
              className="dark:border-white/50 dark:bg-transparent dark:hover:text-black dark:hover:bg-white"
            >
              <FaChevronLeft/>
            </Button>
            <span className="capitalize text-tertiary dark:text-white">
              {open.subMenuLabel}
            </span>
            <Button
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
              variant="outline"
              size="icon"
              className="dark:border-white/50 dark:bg-transparent dark:hover:text-black dark:hover:bg-white"
            >
              <FaXmark/>
            </Button>
          </SheetTitle>
          <SheetDescription className="flex flex-col gap-5 max-h-[calc(100svh-121px)] mt-6 overflow-auto">
            {open.subMenu === "portfolio" && (
              <>
                {subMenuItemsPortfolio.map((item, index) => (
                  <SubMenuItems
                    open={open}
                    setOpen={setOpen}
                    item={item}
                    index={index}
                  />
                ))}
              </>
            )}

            {open.subMenu === "contact" && (
              <>
                {subMenuItemsContact.map((item, index) => (
                  <SubMenuItems
                    open={open}
                    setOpen={setOpen}
                    item={item}
                    index={index}
                  />
                ))}
              </>
            )}
            {open.subMenu === "reports" && (
              <>
                {subMenuItemsReports.map((item, index) => (
                  <SubMenuItems
                    open={open}
                    setOpen={setOpen}
                    item={item}
                    index={index}
                  />
                ))}
              </>
            )}
          </SheetDescription>
        </div>
      )}
    </>
  );
};

export default SubMenu;
