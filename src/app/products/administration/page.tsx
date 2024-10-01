import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Administration = () => {
  return (
    <section className="w-full h-full p-3 min-[1435px]:p-5 flex justify-center items-center">
      <div className="w-full h-full max-w-[90rem] flex flex-col justify-between">
        <>
          <div className="pb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Productos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink>Administrar</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="bg-white rounded shadow flex flex-col">
            <div className="flex flex-col gap-3 min-[550px]:gap-0 min-[550px]:flex-row justify-between items-center w-full border-b p-3">
              <h1 className="text-2xl sm:text-4xl text-secondary font-semibold">
                Reportes
              </h1>

              <div className="flex gap-5">
                <Link
                  href={`/create-property`}
                  className={`${buttonVariants({
                    variant: "default",
                  })}`}
                >
                  Crear Producto
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="py-5 h-full">
          {loading ? (
            <Loading />
          ) : (
            <Datatable
              parameters={parameters}
              setParameters={setParameters}
              onSort={handleSort}
              onFilters={handleFilters}
            />
          )}
        </div> */}

          {/* <Pagination
          totalItems={metaReports?.total_items || null}
          itemsPerPage={metaReports?.per_page || null}
          totalPages={metaReports?.total_pages || null}
          currentPage={currentPageReports}
          setCurrentPage={setCurrentPageReports}
        /> */}
        </>
      </div>
    </section>
  );
};

export default Administration;
