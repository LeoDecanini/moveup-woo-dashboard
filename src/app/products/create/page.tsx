import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CreateForm from "@/components/shared/create-form";

const CreateProduct = () => {
  return (
    <section className="w-full h-full p-3 min-[1435px]:p-5 flex justify-center items-center">
      <div className="w-full h-full max-w-[90rem] flex flex-col justify-between">
        <div>
          <div className="pb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Productos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Crear</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <CreateForm />
        </div>
      </div>
    </section>
  );
};

export default CreateProduct;
