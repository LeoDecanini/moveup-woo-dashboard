"use client";

/* React */
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWoocommerce } from "@/context/woocommerce-context";
import { useWordpress } from "@/context/wordpress-context";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DropzoneOptions } from "react-dropzone";
import { BsPinFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ReactSortable } from "react-sortablejs";

import { cn, ServerUrl } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
/* import axios from "axios"; */

/* Shadcn */
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
/* import Pagination from "../shared/pagination"; */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-uploader";

import PlateEditor from "../plate-editor";
import { buttonVariants } from "../plate-ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import MoveUpLoader from "./moveup-loader";

interface Props { }

interface Field {
  name: string;
  label: string;
  colSpan: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  text?: string;
  options?: any[];
  list?: any;
  actions?: string;
  search?: boolean;
}

interface Tab {
  id: number;
  value?: string;
  fields: Field[];
}

interface SectionWithFields {
  title: string;
  fields: Field[];
}

interface SectionWithTabs {
  title: string;
  type: string;
  tabs: Tab[];
}

type Section = SectionWithFields | SectionWithTabs;

function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const Modal = ({ image, onClose }: any) => {
  if (!image) return null;

  return (
    <div
      onClick={(e) => {
        onClose();
      }}
      className="fixed inset-0 !z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative max-w-4xl w-full">
        <img
          src={URL.createObjectURL(image)}
          alt="Selected"
          className="w-full h-auto max-h-[90svh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

const CreateForm: React.FC<Props> = () => {
  const [editadData, setEditadData] = useState<any | null>(null);
  const [isEditedPropety, setIsEditedPropety] = useState<boolean>(false);

  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  const [productType, setProductType] = useState("variable");
  const [existingAttribute, setExistingAttribute] = useState("");
  const [attributes, setAttributes] = useState<any>([]);
  const [variations, setVariations] = useState<any>(null);
  const [files, setFiles] = useState<File[] | null>([]);
  const [filesGallery, setFilesGallery] = useState<File[] | null>([]);
  const { fetchCategories, fetchTags, addCategory, addTag } = useWordpress();
  const { createProduct } = useWoocommerce();
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [parentCategory, setParentCategory] = useState<number | string>("none");
  const [categories, setCategories] = useState<any[]>([]);
  const [showParentCategory, setShowParentCategory] = useState<any>("none");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagsName, setNewTagsName] = useState<any[]>([]);
  const [newTag, setNewTag] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [rebajaInicio, setRebajaInicio] = React.useState<Date>();
  const [rebajaFin, setRebajaFin] = React.useState<Date>();

  const [filters, setFilters] = useState({
    products: null,
  });

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: 1 * 1920 * 1080,
  } satisfies DropzoneOptions;

  const dropzoneGallery = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 10,
    maxSize: 1 * 1920 * 1080,
  } satisfies DropzoneOptions;

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
    });
    fetchTags().then((data) => {
      setTags(data);
    });
  }, []);

  const tabs = [
    {
      value: "general",
      label: "General",
      condition: (data: any) =>
        data.type === "simple" || data.type === "external",
    },
    { value: "inventory", label: "Inventario", condition: () => true },
    {
      value: "shipping",
      label: "Envío",
      condition: (data: any) =>
        data.type === "simple" || data.type === "variable",
    },
    {
      value: "related-products",
      label: "Productos relacionados",
      condition: () => true,
    },
    { value: "attributes", label: "Atributos", condition: () => true },
    {
      value: "variations",
      label: "Variaciones",
      condition: (data: any) => data.type === "variable",
    },
    { value: "advanced", label: "Avanzado", condition: () => true },
  ];

  /* useEffect(() => {
    const paramValue = getQueryParam("project");
    if (paramValue) {
      axios
        .get(`${ServerUrl}/projects/${paramValue}`, {
          headers: {
            Authorization: `Bearer ${tokenFromCookie}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setEditadData(response.data);
            .log(response.data);
          }
        })
        .catch((error) => {
          toast.error("Error al cargar el proyecto");
          navigate("/portfolio/projects");
          console.log(error);
        });
    } else {
      if (currentPath !== "/create-project") {
        toast.error("No se reconocio ningun proyecto con ese nombre.");
        navigate("/create-project");
      }
    }
  }, []); */

  const [formData, setFormData] = useState<Record<string, any>>({
    type: productType,
    inventory_management: false,
    reserves: "no",
    name: "",
    description: "",
    short_description: "",
    sku: "",
    code: "",
    slug: "",
    sold_individually: false,
    stock_quantity: 0,
    low_existens: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    program: false,
    files: [],
    filesGallery: [],
    date_on_sale_from: null,
    date_on_sale_to: null,
    price: "",
    discounted_price: "",
    weight: 0,
    stock_status: "instock",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (editadData) {
      setIsEditedPropety(true);
      setFormData({});
    } else {
      setIsEditedPropety(false);
    }
  }, [editadData]);

  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {},
  );

  let fieldsDataTypeSimple: Section[] = [
    {
      title: "Datos principales",
      fields: [
        {
          name: "name",
          label: "Nombre del producto",
          colSpan: "col-span-2 min-[720px]:col-span-1 min-[1400px]:col-span-2",
          type: "text",
        },
        {
          name: "slug",
          label: "Slug",
          colSpan: "col-span-2 min-[720px]:col-span-1",
          type: "text",
          min: 3,
        },
        {
          name: "description",
          label: "Descripcion del producto",
          colSpan: "col-span-2 min-[1400px]:col-span-3",
          type: "textarea",
          max: 500,
        },
        {
          name: "short_description",
          label: "Descripcion corta del producto",
          colSpan: "col-span-2 min-[1400px]:col-span-3",
          type: "textarea",
          max: 250,
        },
      ],
    },
    {
      title: "Datos del producto",
      type: productType,
      tabs: [
        {
          id: 1,
          value: "general",
          fields: [
            {
              name: "price",
              label: "Precio normal ($)",
              colSpan: "col-span-1",
              type: "number",
            },
            {
              name: "discounted_price",
              label: "Precio rebajado ($)",
              colSpan: "col-span-1",
              type: "number",
            },
            {
              name: "date_on_sale_from",
              label: "Fechas del precio rebajado",
              colSpan: "col-span-1",
              type: "date",
              actions: "general-view-program",
            },
            {
              name: "date_on_sale_to",
              label: "",
              colSpan: "col-span-1",
              type: "date",
              actions: "general-view-program",
            },
            {
              name: "program",
              label: "",
              colSpan: "col-span-1",
              type: "options",
              actions: "general-view-program",
            },
          ],
        },
        {
          id: 2,
          value: "inventory",
          fields: [
            {
              name: "sku",
              label: "SKU",
              colSpan: "col-span-1",
              type: "text",
            },
            {
              name: "code",
              label: "GTIN, UPC, EAN o ISBN",
              colSpan: "col-span-1",
              type: "text",
            },
            {
              name: "inventory_management",
              label: "Gestión de inventario",
              colSpan: "col-span-1",
              type: "check",
              text: "Hacer seguimiento de la cantidad de inventario de este producto",
            },

            {
              name: "stock_quantity",
              label: "Cantidad",
              colSpan: "col-span-1",
              type: "number",
            },
            {
              name: "reserves",
              label: "¿Permitir reservas?",
              colSpan: "col-span-1",
              type: "radio",
              options: [
                { label: "No permitir", value: "no" },
                {
                  label: "Permitir, pero se avisará al cliente",
                  value: "notify",
                },
                { label: "Permitir", value: "yes" },
              ],
            },
            {
              name: "low_existens",
              label: "Umbral de pocas existencias",
              colSpan: "col-span-1",
              type: "number",
            },
            {
              name: "stock_status",
              label: "Estado de inventario",
              colSpan: "col-span-1",
              type: "radio",
              options: [
                { label: "Hay existencias", value: "instock" },
                {
                  label: "No hay existencias",
                  value: "putofstock",
                } /* poner backorder en yex */,
                { label: "Se puede reservar", value: "onbackorder" },
              ],
            },
            {
              name: "sold_individually",
              label: "Vendido individualmente",
              colSpan: "col-span-1",
              type: "check",
              text: "Limitar compras a 1 artículo por pedido",
            },
          ],
        },
        {
          id: 3,
          value: "shipping",
          fields: [
            {
              name: "weight",
              label: "Peso (kg)",
              colSpan: "col-span-1",
              type: "number",
            },
            {
              name: "dimensions",
              label: "Dimensiones (cm)",
              colSpan: "col-span-1",
              type: "text",
              options: [
                {
                  label: "Longitud",
                  formdata: "length",
                },
                {
                  label: "Ancho",
                  formdata: "width",
                },
                {
                  label: "Alto",
                  formdata: "height",
                },
              ],
            },
            {
              name: "shipping_class",
              label: "Clase de envío",
              colSpan: "col-span-1",
              type: "select",
              options: [
                {
                  label: "Ninguna clase de envio",
                  formdata: "any",
                },
                {
                  label: "Correo argentino",
                  formdata: "correo_argentino",
                },
                {
                  label: "Andreani",
                  formdata: "andreani",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          value: "related-products",
          fields: [
            {
              name: "targeted_sales",
              label: "Ventas dirigidas",
              colSpan: "col-span-1",
              type: "select",
              search: true,
            },
            {
              name: "cross_selling",
              label: "Ventas cruzadas",
              colSpan: "col-span-1",
              type: "select",
              search: true,
            },
          ],
        },
        {
          id: 5,
          value: "attributes",
          fields: [],
        },
        {
          id: 5,
          value: "variations",
          fields: [],
        },
        {
          id: 6,
          value: "advanced",
          fields: [
            {
              name: "purchase_note",
              label: "Nota de compra",
              colSpan: "col-span-1",
              type: "textarea",
            },
            {
              name: "order_on_the_menu",
              label: "Orden en el menú",
              colSpan: "col-span-1",
              type: "textarea",
            },
            {
              name: "activate_reviews",
              label: "Activa las valoraciones",
              colSpan: "col-span-1",
              type: "check",
            },
          ],
        },
      ],
    },
  ];

  if (formData["inventory_management"] !== true) {
    fieldsDataTypeSimple = fieldsDataTypeSimple.map((section: any) => {
      if (section.title === "Datos del producto") {
        return {
          ...section,
          tabs: section.tabs.map((tab: any) => ({
            ...tab,
            fields: tab.fields.filter(
              (field: any) =>
                field.name !== "stock_quantity" &&
                field.name !== "reserves" &&
                field.name !== "low_existens",
            ),
          })),
        };
      }
      return section;
    });
  }

  if (formData["program"] !== true) {
    fieldsDataTypeSimple = fieldsDataTypeSimple.map((section: any) => {
      if (section.title === "Datos del producto") {
        return {
          ...section,
          tabs: section.tabs.map((tab: any) => ({
            ...tab,
            fields: tab.fields.filter(
              (field: any) =>
                field.name !== "date_on_sale_from" &&
                field.name !== "date_on_sale_to",
            ),
          })),
        };
      }
      return section;
    });
  }

  if (formData["inventory_management"] === true) {
    fieldsDataTypeSimple = fieldsDataTypeSimple.map((section: any) => {
      if (section.title === "Datos del producto") {
        return {
          ...section,
          tabs: section.tabs.map((tab: any) => ({
            ...tab,
            fields: tab.fields.filter(
              (field: any) => field.name !== "stock_status",
            ),
          })),
        };
      }
      return section;
    });
  }

  let noValid = false;

  const validateField = (name: string, value: string) => {
    const newErrorMessages: Record<string, string> = {};

    let field: Field | undefined;

    fieldsDataTypeSimple.some((section) => {
      if ("fields" in section) {
        field = section.fields.find((f) => f.name === name);
      } else if ("tabs" in section) {
        section.tabs.some((tab) => {
          field = tab.fields.find((f) => f.name === name);
          return !!field;
        });
      }
      return !!field;
    });

    if (field) {
      if (field.required && !value) {
        newErrorMessages[name] = "Por favor, complete el campo.";
      } else if (field.min && value.length < field.min) {
        newErrorMessages[name] =
          `Por favor, ingrese al menos ${field.min} caracteres.`;
      } else if (field.max && value.length > field.max) {
        newErrorMessages[name] =
          `Por favor, ingrese como máximo ${field.max} caracteres.`;
      } else if (field.type === "number" && value) {
        if (!value) {
          newErrorMessages[name] = "Por favor, ingrese un número.";
        } else if (isNaN(Number(value))) {
          newErrorMessages[name] = "Debe ser un número válido.";
        } else if (Number(value) < 0) {
          newErrorMessages[name] = "Debe ser un número no negativo.";
        }
      }
    }

    setErrorMessages((prevErrorMessages) => {
      const updatedErrorMessages = {
        ...prevErrorMessages,
        ...newErrorMessages,
      };

      if (newErrorMessages[name] === undefined) {
        delete updatedErrorMessages[name];
      }

      return updatedErrorMessages;
    });

    if (Object.keys(newErrorMessages).length > 0) {
      noValid = true;
    }
  };

  const validateForm = (): boolean => {
    noValid = false;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    console.log(noValid);

    return !noValid;
  };

  useEffect(() => {
    console.log(files);
    setFormData((prevFormData) => ({
      files: files,
      filesGallery: filesGallery,
      rebajaFin: rebajaFin || null,
      rebajaInicio: rebajaInicio || null,
      ...prevFormData,
    }));
  }, [files, filesGallery, rebajaFin, rebajaInicio]);

  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingForm(true);

    const validateData = validateForm();

    console.log(formData);

    const {
      name,
      price,
      discounted_price,
      description,
      short_description,
      sku,
      dimensions,
      inventory_management,
      stock_quantity,
      weight,
      slug,
      reserves,
      stock_status,
    } = formData;

    const data = {
      name: name,
      ...(slug !== 0 ? { slug } : {}),
      type: productType,
      status: "publish",
      regular_price: price,
      sale_price: discounted_price,
      description: description,
      short_description: short_description,
      sku: sku,
      ...(weight !== 0 ? { weight } : {}),
      ...(dimensions.length !== 0 ||
        dimensions.width !== 0 ||
        dimensions.height !== 0
        ? { dimensions }
        : {}),
      manage_stock: inventory_management,
      stock_quantity: stock_quantity,
      ...(inventory_management
        ? { backorders: reserves }
        : { backorders: "yes" }),
      ...(!inventory_management ? { stock_status: stock_status } : {}),
    };

    console.log(data);

    createProduct(data).then(async (response) => {
      console.log(response);
      await fetchTags().then((data) => {
        router.push("/");
        setLoadingForm(false);
      });
    });
  };

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      products: value !== "" ? value : null,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      products: null,
    }));
  };

  useEffect(() => {
    attributes.forEach((attr: any) => {
      attr.options.forEach((option: any) => {
        if (attr.save) {
          console.log(attributes);
        }
      });
    });
  }, [attributes]);

  const handleAddCategory = async () => {
    const parent = parentCategory === "none" ? 0 : parentCategory;
    const data = {
      name: newCategoryName,
      parent,
    };

    addCategory(data).then(async (response) => {
      console.log(response);
      await fetchCategories().then((data) => {
        setCategories(data);
      });

      setSelectedCategories((prevSelectedCategories) => [
        ...prevSelectedCategories,
        response,
      ]);

      setNewCategory(false);
      setNewCategoryName("");
    });
  };

  const handleAddTag = async () => {
    const data = { name: newTagName };

    addTag(data).then(async (response) => {
      console.log(response);
      await fetchTags().then((data) => {
        setTags(data);
      });

      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, response]);

      setNewTag(false);
      //@ts-ignore
      setNewTagName("");
    });
  };

  function findCategoryById(id, categories) {
    console.log({ id, categories });
    return categories.find((category) => category.id == id);
  }

  const hasFiles = files && files.length > 0;
  const hasFilesGallery = filesGallery && filesGallery.length > 0;

  const handleImageClick = (file: File) => {
    setSelectedImage(file);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  const [newAttribute, setNewAttribute] = useState<any>(false);

  useEffect(() => {
    console.log(variations);
  }, [variations]);

  const generateVariations = (attributes: any) => {
    console.log("Atributos iniciales:", attributes);

    setVariations(null);

    // Filtrar atributos que tengan "variation" en true y opciones disponibles
    const attributeValues = attributes
      .filter(
        (attribute: any) => attribute.variation && attribute.options.length > 0,
      )
      .map((attribute: any) => ({
        name: attribute.name,
        values: attribute.options,
      }));

    console.log("Atributos filtrados:", attributeValues);

    if (attributeValues.length === 0) {
      console.log(
        "No hay atributos con variation activado y opciones disponibles",
      );
      return;
    }

    // Función para combinar todas las opciones de los atributos
    const combine = (arrays: any): any[] => {
      if (arrays.length === 0) return [[]];

      const first = arrays[0];
      const rest = arrays.slice(1);

      const combinationsWithoutFirst = combine(rest);
      const combinationsWithFirst = first.values.flatMap((value: any) =>
        combinationsWithoutFirst.map((combo: any) => [
          { name: first.name, value },
          ...combo,
        ]),
      );

      return combinationsWithFirst;
    };

    const allVariations = combine(attributeValues).map((variation: any) => ({
      id: Date.now(),
      attributes: variation,
      sku: "",
      code: "",
      regular_price: 0,
      sale_price: 0,
      stock_status: "in_stock",
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      description: "",
      file: null,
    }));

    console.log("Variaciones generadas:", allVariations);

    setVariations(allVariations);
  };

  const fields = [
    {
      name: "file",
      label: "Imagen",
      colSpan: "col-span-1",
      type: "file",
    },
    {
      name: "identifiers",
      label: "Identificadores",
      colSpan: "col-span-1",
      type: "text",
      options: [
        {
          label: "SKU",
          formdata: "sku",
        },
        {
          label: "GTIN, UPC, EAN o ISBN",
          formdata: "code",
        },
      ],
    },
    {
      name: "regular_price",
      label: "Precio Regular",
      colSpan: "col-span-1",
      type: "number",
    },
    {
      name: "sale_price",
      label: "Precio en Oferta",
      colSpan: "col-span-1",
      type: "number",
    },
    {
      name: "stock_status",
      label: "Estado de Stock",
      colSpan: "col-span-1",
      type: "select",
      options: ["in_stock", "out_of_stock", "backorder"],
    },
    {
      name: "weight",
      label: "Peso",
      colSpan: "col-span-1",
      type: "number",
    },
    {
      name: "dimensions",
      label: "Dimensiones (cm)",
      colSpan: "col-span-1",
      type: "text",
      options: [
        {
          label: "Longitud",
          formdata: "length",
        },
        {
          label: "Ancho",
          formdata: "width",
        },
        {
          label: "Alto",
          formdata: "height",
        },
      ],
    },

    {
      name: "description",
      label: "Descripción",
      colSpan: "col-span-2",
      type: "textarea",
    },
  ];

  return (
    <>
      {loadingForm && (
        <div className="fixed z-[1000] flex flex-col bg-white/50 dark:bg-black/80 backdrop-blur-sm w-full justify-center items-center h-screen left-0 top-0">
          <MoveUpLoader className="mb-2" />

          <div className={"text-black dark:text-white w-full text-center"}>
            Cargando los datos de su producto, <br /> Por favor no recargue la
            página.
          </div>
        </div>
      )}

      {isModalOpen && (
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}

      <div className="bg-white rounded-md shadow flex flex-col">
        <div className="flex flex-col gap-3 min-[550px]:gap-0 min-[550px]:flex-row justify-between items-center w-full border-b p-3">
          <h1 className="text-2xl sm:text-4xl text-secondary font-semibold">
            Crear Producto
          </h1>
          <Select
            onValueChange={(value) => {
              setProductType(value);
            }}
            defaultValue={productType}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Tipo de producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"simple"}>Producto simple</SelectItem>
              <SelectItem value={"agruped"}>Producto agrupado</SelectItem>
              <SelectItem value={"external"}>
                Producto externo/afiliado
              </SelectItem>
              <SelectItem value={"variable"}>Producto variable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form className={"flex gap-4"} onSubmit={handleSubmit}>
        <>
          <div className={"w-full"}>
            {fieldsDataTypeSimple.map((data, index) => (
              <div className="grid grid-cols-2 min-[1400px]:grid-cols-3 gap-3 rounded-md mt-5 bg-white p-3 shadow">
                <h4 className={`col-span-2 min-[1400px]:col-span-3 border-b`}>
                  {data.title}
                </h4>

                {"type" in data ? (
                  <div className="col-span-2 min-[1400px]:col-span-3 border rounded">
                    <Tabs
                      defaultValue="general"
                      className="flex items-start h-full !w-full"
                    >
                      <TabsList className="gap-0 p-0 flex flex-col justify-start items-start border-r rounded-none h-full bg-muted w-[230px]">
                        {tabs.map(
                          ({ value, label, condition }) =>
                            condition(data) && (
                              <TabsTrigger
                                key={value}
                                className="!rounded-none w-full !items-start justify-start px-3 py-2 border-b"
                                value={value}
                              >
                                {label}
                              </TabsTrigger>
                            ),
                        )}
                      </TabsList>

                      <div className="!w-full h-full p-3">
                        {data.tabs.map((tab) => (
                          <TabsContent
                            key={tab.value}
                            className="!w-full grid gap-y-5 gap-x-3 m-0"
                            value={tab.value || ""}
                          >
                            {tab.value === "attributes" ? (
                              <div className="w-full">
                                <div className="w-full flex items-center gap-2 pb-3">
                                  <Button
                                    variant={"outline"}
                                    onClick={() => {
                                      setNewAttribute({
                                        id: Date.now(),
                                        name: "",
                                        options: [""],
                                        visible: false,
                                        variation: true,
                                        save: false,
                                      });
                                    }}
                                    className="bg-transparent hidden sm:block border-primary h-8 py-0 hover:text-primary px-5 text-primary hover:bg-primary/10"
                                    type="button"
                                  >
                                    Crear nuevo
                                  </Button>

                                  <Select
                                    onValueChange={(value) => {
                                      setExistingAttribute(value);
                                    }}
                                  >
                                    <SelectTrigger className="w-[170px]">
                                      <SelectValue placeholder="añadir existente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={"colors"}>
                                        Colores
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Accordion
                                  className="mb-2"
                                  type="single"
                                  collapsible
                                >
                                  {attributes &&
                                    attributes.length > 0 &&
                                    attributes.map(
                                      (attribute: any, attrIndex: number) => (
                                        <AccordionItem
                                          key={attribute.id}
                                          value={`item-${attribute.id}`}
                                        >
                                          <AccordionTrigger className="hover:no-underline">
                                            {attribute.name}
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            <div className="relative p-2 border rounded-md">
                                              <div className="absolute right-2 flex items-center gap-2">
                                                <Button
                                                  variant="outline"
                                                  onClick={() => {
                                                    setAttributes((prev: any) =>
                                                      prev.map(
                                                        (
                                                          attr: any,
                                                          index: number,
                                                        ) => {
                                                          if (
                                                            index === attrIndex
                                                          ) {
                                                            return {
                                                              ...attr,
                                                              options: [
                                                                ...attr.options,
                                                                "",
                                                              ],
                                                            };
                                                          }
                                                          return attr;
                                                        },
                                                      ),
                                                    );
                                                  }}
                                                  className="bg-transparent border-secondary h-8 py-0 hover:text-secondary px-5 text-secondary hover:bg-secondary/10"
                                                  type="button"
                                                >
                                                  Agregar valor
                                                </Button>
                                              </div>

                                              <div>
                                                <Label
                                                  className={`${errorMessages[
                                                    attribute?.id
                                                  ] && "text-accent"
                                                    } flex items-center gap-1 pb-1`}
                                                  htmlFor={attribute?.name}
                                                >
                                                  Nombre
                                                </Label>
                                                <Input
                                                  id={attribute?.name}
                                                  type="text"
                                                  onChange={(event) => {
                                                    const value =
                                                      event.target.value;
                                                    setAttributes((prev: any) =>
                                                      prev.map(
                                                        (
                                                          attr: any,
                                                          index: number,
                                                        ) => {
                                                          if (
                                                            index === attrIndex
                                                          ) {
                                                            return {
                                                              ...attr,
                                                              name: value,
                                                            };
                                                          }
                                                          return attr;
                                                        },
                                                      ),
                                                    );
                                                    validateField(
                                                      attribute?.name,
                                                      value,
                                                    );
                                                  }}
                                                  value={attribute?.name || ""}
                                                  name={attribute?.name}
                                                  className="max-w-[400px]"
                                                />
                                                {errorMessages[
                                                  attribute?.id
                                                ] && (
                                                    <p className="text-accent text-xs">
                                                      {
                                                        errorMessages[
                                                        attribute?.id
                                                        ]
                                                      }
                                                    </p>
                                                  )}
                                              </div>

                                              <div className="pt-3">
                                                <Label className="flex items-center gap-1 pb-1">
                                                  Valores
                                                </Label>
                                                <div className="w-full grid grid-cols-5 gap-2">
                                                  {attribute?.options.map(
                                                    (
                                                      option: string,
                                                      optIndex: number,
                                                    ) => (
                                                      <div
                                                        key={optIndex}
                                                        className="relative"
                                                      >
                                                        <Input
                                                          type="text"
                                                          onChange={(event) => {
                                                            const value =
                                                              event.target
                                                                .value;
                                                            setAttributes(
                                                              (prev: any) =>
                                                                prev.map(
                                                                  (
                                                                    attr: any,
                                                                    index: number,
                                                                  ) => {
                                                                    if (
                                                                      index ===
                                                                      attrIndex
                                                                    ) {
                                                                      const updatedOptions =
                                                                        attr.options.map(
                                                                          (
                                                                            opt: string,
                                                                            i: number,
                                                                          ) =>
                                                                            i ===
                                                                              optIndex
                                                                              ? value
                                                                              : opt,
                                                                        );
                                                                      return {
                                                                        ...attr,
                                                                        options:
                                                                          updatedOptions,
                                                                      };
                                                                    }
                                                                    return attr;
                                                                  },
                                                                ),
                                                            );
                                                          }}
                                                          value={option}
                                                          className="max-w-[400px]"
                                                          placeholder={`Valor ${optIndex + 1}`}
                                                        />
                                                        <IoClose
                                                          className="text-accent absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                          onClick={() => {
                                                            setAttributes(
                                                              (prev: any) =>
                                                                prev.map(
                                                                  (
                                                                    attr: any,
                                                                    index: number,
                                                                  ) => {
                                                                    if (
                                                                      index ===
                                                                      attrIndex
                                                                    ) {
                                                                      return {
                                                                        ...attr,
                                                                        options:
                                                                          attr.options.filter(
                                                                            (
                                                                              _: string,
                                                                              i: number,
                                                                            ) =>
                                                                              i !==
                                                                              optIndex,
                                                                          ),
                                                                      };
                                                                    }
                                                                    return attr;
                                                                  },
                                                                ),
                                                            );
                                                          }}
                                                        />
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              </div>

                                              <div className="flex items-center space-x-2 pt-3">
                                                <Checkbox
                                                  onCheckedChange={(
                                                    checked,
                                                  ) => {
                                                    setAttributes((prev: any) =>
                                                      prev.map(
                                                        (
                                                          attr: any,
                                                          index: number,
                                                        ) => {
                                                          if (
                                                            index === attrIndex
                                                          ) {
                                                            return {
                                                              ...attr,
                                                              visible: checked,
                                                            };
                                                          }
                                                          return attr;
                                                        },
                                                      ),
                                                    );
                                                  }}
                                                  defaultChecked={
                                                    attribute?.visible
                                                  }
                                                  id={`${attribute?.name}-visible`}
                                                />
                                                <label
                                                  htmlFor={`${attribute?.name}`}
                                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                  Visible en la página de
                                                  productos
                                                </label>
                                              </div>

                                              {/* Botones Guardar y Eliminar */}
                                              <div className="flex justify-end space-x-2 pt-4">
                                                <Button
                                                  variant="outline"
                                                  className="bg-transparent hidden sm:block border-accent h-8 py-0 hover:text-accent px-5 text-accent hover:bg-accent/10"
                                                  onClick={() => {
                                                    setAttributes((prev: any) =>
                                                      prev.filter(
                                                        (
                                                          _: any,
                                                          index: number,
                                                        ) =>
                                                          index !== attrIndex,
                                                      ),
                                                    );
                                                  }}
                                                >
                                                  Eliminar
                                                </Button>
                                              </div>
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      ),
                                    )}
                                </Accordion>

                                {newAttribute && (
                                  <div className="relative p-2 border rounded-md">
                                    <div className="absolute right-2 flex items-center gap-2">
                                      <Button
                                        variant={"outline"}
                                        onClick={() => {
                                          setNewAttribute((prev: any) => ({
                                            ...prev,
                                            options: [...prev.options, ""],
                                          }));
                                        }}
                                        className="bg-transparent hidden sm:block border-secondary h-8 py-0 hover:text-secondary px-5 text-secondary hover:bg-secondary/10"
                                        type="button"
                                      >
                                        Agregar valor
                                      </Button>

                                      <Button
                                        variant={"outline"}
                                        onClick={() => {
                                          setNewAttribute(null);
                                        }}
                                        className="bg-transparent hidden sm:block border-accent h-8 py-0 hover:text-accent px-5 text-accent hover:bg-accent/10"
                                        type="button"
                                      >
                                        Cancelar
                                      </Button>
                                    </div>

                                    {/* Formulario para crear un nuevo atributo */}
                                    <div>
                                      <Label htmlFor={newAttribute.name}>
                                        Nombre
                                      </Label>
                                      <Input
                                        id={newAttribute.name}
                                        type="text"
                                        value={newAttribute.name || ""}
                                        onChange={(e) =>
                                          setNewAttribute((prev: any) => ({
                                            ...prev,
                                            name: e.target.value,
                                          }))
                                        }
                                        className="max-w-[400px]"
                                      />
                                    </div>

                                    <div className="pt-3">
                                      <Label>Valores</Label>
                                      <div className="grid grid-cols-5 gap-2">
                                        {newAttribute.options.map(
                                          (
                                            option: string,
                                            optIndex: number,
                                          ) => (
                                            <div
                                              key={optIndex}
                                              className="relative"
                                            >
                                              <Input
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  setNewAttribute(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      options: prev.options.map(
                                                        (
                                                          opt: string,
                                                          i: number,
                                                        ) =>
                                                          i === optIndex
                                                            ? value
                                                            : opt,
                                                      ),
                                                    }),
                                                  );
                                                }}
                                                className="max-w-[400px]"
                                                placeholder={`Valor ${optIndex + 1}`}
                                              />
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>

                                    <div className="pt-3 flex items-center space-x-2">
                                      <Checkbox
                                        onCheckedChange={(checked) => {
                                          setNewAttribute((prev: any) => ({
                                            ...prev,
                                            visible: checked,
                                          }));
                                        }}
                                        checked={newAttribute.visible}
                                        id={`${newAttribute.name}-visible`}
                                      />
                                      <label
                                        htmlFor={`${newAttribute.name}-visible`}
                                      >
                                        Visible en la página de productos
                                      </label>
                                    </div>

                                    <div className="pt-3 flex items-center justify-end">
                                      <Button
                                        variant="secondary"
                                        onClick={() => {
                                          setAttributes((prev: any) => [
                                            ...prev,
                                            newAttribute,
                                          ]);
                                          setNewAttribute(null);
                                        }}
                                        className="px-10"
                                        type="button"
                                      >
                                        Guardar
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : tab.value === "variations" ? (
                              <>
                                <div className="w-full min-h-[198px] flex justify-center flex-col text-center">
                                  {attributes?.length === 0 ||
                                    attributes === null ? (
                                    <p>
                                      Añade algunos atributos en la pestaña
                                      Atributos para generar variaciones.
                                      Asegúrate de marcar la casilla Usado para
                                      variaciones.
                                    </p>
                                  ) : (
                                    <div className="relative h-full">
                                      <div className="flex gap-2 items-center">
                                        <Button
                                          variant={"outline"}
                                          onClick={() =>
                                            generateVariations(attributes)
                                          }
                                          className="bg-transparent hidden sm:block border-secondary h-8 py-0 hover:text-secondary px-5 text-secondary hover:bg-secondary/10"
                                          type="button"
                                        >
                                          Generar variaciones
                                        </Button>

                                        <Button
                                          variant={"outline"}
                                          onClick={() => { }}
                                          className="bg-transparent hidden sm:block border-accent h-8 py-0 hover:text-accent px-5 text-accent hover:bg-accent/10"
                                          type="button"
                                        >
                                          Agregar manualmente
                                        </Button>
                                      </div>

                                      {variations?.length > 0 && (
                                        <Accordion type="single" collapsible>
                                          {variations?.map(
                                            (variation, index) => (
                                              <AccordionItem
                                                value={`${index}`}
                                                key={variation.id}
                                              >
                                                <AccordionTrigger>
                                                  <div className="flex items-center gap-2">
                                                    {variation.attributes.map(
                                                      (
                                                        attribute: any,
                                                        attrIndex: number,
                                                      ) => (
                                                        <div
                                                          key={attrIndex}
                                                          className={`my-2`}
                                                        >
                                                          <Select
                                                            onValueChange={(
                                                              value,
                                                            ) => {
                                                              const newValue =
                                                                value;
                                                            }}
                                                            defaultValue={
                                                              attribute.value
                                                            }
                                                          >
                                                            <SelectTrigger className="w-[170px]">
                                                              <SelectValue
                                                                placeholder={`Seleccionar ${attribute.name}`}
                                                              />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                              {attributes
                                                                .find(
                                                                  (attr: any) =>
                                                                    attr.name ===
                                                                    attribute.name,
                                                                )
                                                                ?.options.map(
                                                                  (
                                                                    option: string,
                                                                    optionIndex: number,
                                                                  ) => (
                                                                    <SelectItem
                                                                      key={
                                                                        optionIndex
                                                                      }
                                                                      value={
                                                                        option
                                                                      }
                                                                    >
                                                                      {option}
                                                                    </SelectItem>
                                                                  ),
                                                                )}
                                                            </SelectContent>
                                                          </Select>
                                                        </div>
                                                      ),
                                                    )}
                                                  </div>
                                                </AccordionTrigger>

                                                <AccordionContent
                                                  className={`w-full grid grid-cols-2 gap-3 p-1`}
                                                >
                                                  {fields.map(
                                                    (fieldInfo, fieldIndex) => (
                                                      <div
                                                        className={` ${fieldInfo.name === "stock_status" || fieldInfo.name === "description" ? "col-span-2" : ""}`}
                                                        key={fieldIndex}
                                                      >
                                                        <Label
                                                          className={`flex items-center text-left gap-1 pb-1 max-w-[200px] w-full line-clamp-2`}
                                                          htmlFor={
                                                            fieldInfo.name
                                                          }
                                                        >
                                                          {fieldInfo.label}
                                                        </Label>

                                                        {fieldInfo.name ===
                                                          "dimensions" ? (
                                                          <div className="flex gap-2">
                                                            {/* @ts-ignore */}
                                                            {fieldInfo.options.map(
                                                              (option) => (
                                                                <Input
                                                                  key={
                                                                    option.formdata
                                                                  }
                                                                  placeholder={
                                                                    option.label
                                                                  }
                                                                  type="number"
                                                                  onChange={(
                                                                    event,
                                                                  ) => {
                                                                    const value =
                                                                      event
                                                                        .target
                                                                        .value; // Captura el valor ingresado
                                                                    const updatedVariations =
                                                                      [
                                                                        ...variations,
                                                                      ]; // Crea una copia de las variaciones
                                                                    updatedVariations[
                                                                      index
                                                                    ] = {
                                                                      ...updatedVariations[
                                                                      index
                                                                      ],
                                                                      dimensions:
                                                                      {
                                                                        ...updatedVariations[
                                                                          index
                                                                        ]
                                                                          .dimensions,
                                                                        [option.formdata]:
                                                                          value, // Asigna el valor al campo correspondiente
                                                                      },
                                                                    };
                                                                    setVariations(
                                                                      updatedVariations,
                                                                    ); // Actualiza el estado de variaciones
                                                                  }}
                                                                  value={
                                                                    variation
                                                                      .dimensions[
                                                                    option
                                                                      .formdata
                                                                    ] || ""
                                                                  } // Asigna el valor correspondiente del estado
                                                                  className="max-w-[100px]"
                                                                />
                                                              ),
                                                            )}
                                                          </div>
                                                        ) : fieldInfo.name === "identifiers" ? (
                                                          <div className="flex flex-col gap-5">
                                                            {/* @ts-ignore */}
                                                            {fieldInfo.options.map((option) => (
                                                              <Input
                                                                key={option.formdata}
                                                                placeholder={option.label}
                                                                type="text"
                                                                onChange={(event) => {
                                                                  const value = event.target.value;
                                                                  const updatedVariations = [...variations];
                                                                  updatedVariations[index] = {
                                                                    ...updatedVariations[index],
                                                                    [option.formdata]: value, // Guardar el valor en la variación específica
                                                                  };
                                                                  setVariations(updatedVariations);
                                                                }}
                                                                value={variation[option.formdata] || ""} // Usar el valor actual de la variación
                                                              />
                                                            ))}
                                                          </div>
                                                        ) : fieldInfo.type ===
                                                          "text" ||
                                                          fieldInfo.type ===
                                                          "number" ? (
                                                          <Input
                                                            id={fieldInfo.name}
                                                            type={
                                                              fieldInfo.type
                                                            }
                                                            onChange={(
                                                              event,
                                                            ) => {
                                                              const value =
                                                                event.target
                                                                  .value;
                                                              const updatedVariation =
                                                              {
                                                                ...variation,
                                                                [fieldInfo.name]:
                                                                  value,
                                                              };
                                                              console.log(
                                                                updatedVariation,
                                                              );
                                                            }}
                                                            defaultValue={
                                                              variation[
                                                              fieldInfo.name
                                                              ] || ""
                                                            }
                                                            name={
                                                              fieldInfo.name
                                                            }
                                                            className="max-w-[400px]"
                                                          />
                                                        ) : fieldInfo.type ===
                                                          "select" ? (
                                                          <Select
                                                            onValueChange={(
                                                              value,
                                                            ) => {
                                                              const updatedVariations =
                                                                [...variations];
                                                              updatedVariations[
                                                                index
                                                              ] = {
                                                                ...updatedVariations[
                                                                index
                                                                ],
                                                                [fieldInfo.name]:
                                                                  value, // Guardar el valor en la variación específica
                                                              };
                                                              setVariations(
                                                                updatedVariations,
                                                              );
                                                            }}
                                                            defaultValue={
                                                              variation[
                                                              fieldInfo.name
                                                              ] || "any"
                                                            } // Usar el valor actual de la variación
                                                          >
                                                            <SelectTrigger className="w-[400px]">
                                                              <SelectValue placeholder="Seleccionar opción" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                              {/* @ts-ignore */}
                                                              {fieldInfo?.options.map(
                                                                (option) => (
                                                                  <SelectItem
                                                                    key={option}
                                                                    value={
                                                                      option
                                                                    }
                                                                  >
                                                                    {option}
                                                                  </SelectItem>
                                                                ),
                                                              )}
                                                            </SelectContent>
                                                          </Select>
                                                        ) : fieldInfo.type === "file" ? (
                                                          <FileUploader
                                                            value={variation.file} // Cambiar el valor a la propiedad file de la variación
                                                            onValueChange={(newFiles) => {
                                                              const updatedVariations = [...variations];
                                                              updatedVariations[index] = {
                                                                ...updatedVariations[index],
                                                                file: newFiles, // Guardar el nuevo archivo en la variación
                                                              };
                                                              setVariations(updatedVariations);
                                                            }}
                                                            dropzoneOptions={dropzone}
                                                            className="flex flex-col gap-2"
                                                          >
                                                            <div>
                                                              {variation.file && variation.file.length > 0 ? ( // Verifica si hay archivos
                                                                <>
                                                                  <img
                                                                    onClick={() => handleImageClick(variation.file[0])}
                                                                    className="w-full h-40 object-cover aspect-square rounded-lg cursor-pointer"
                                                                    src={URL.createObjectURL(variation.file[0])}
                                                                    alt=""
                                                                  />
                                                                </>
                                                              ) : (
                                                                <FileInput className="w-full h-40 flex items-center justify-center text-center border-2 rounded-lg border-dashed border-accent/50">
                                                                  <div className="flex items-center justify-center text-center flex-col">
                                                                    <svg
                                                                      className="w-8 h-8 mb-3 text-accent/70 dark:text-accent/70"
                                                                      aria-hidden="true"
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      fill="none"
                                                                      viewBox="0 0 20 16"
                                                                    >
                                                                      <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                                      ></path>
                                                                    </svg>
                                                                    <p className="mb-1 text-sm text-accent/70 dark:text-accent/70">
                                                                      <span className="font-semibold">Click to upload</span>&nbsp; or drag and drop
                                                                    </p>
                                                                    <p className="text-xs text-accent/70 dark:text-accent/70">
                                                                      SVG, PNG, JPG or GIF
                                                                    </p>
                                                                  </div>
                                                                </FileInput>
                                                              )}
                                                            </div>
                                                            <FileUploaderContent>
                                                              {variation.file && variation.file.map((item: any, index: any) => (
                                                                <FileUploaderItem
                                                                  className="group"
                                                                  key={index}
                                                                  index={index}
                                                                >
                                                                  <span className="truncate max-w-52">{item.name}</span>
                                                                </FileUploaderItem>
                                                              ))}
                                                            </FileUploaderContent>
                                                          </FileUploader>
                                                        ) : (
                                                          <Textarea
                                                            id={fieldInfo.name}
                                                            onChange={(
                                                              event,
                                                            ) => {
                                                              const value =
                                                                event.target
                                                                  .value;
                                                              const updatedVariation =
                                                              {
                                                                ...variation,
                                                                [fieldInfo.name]:
                                                                  value,
                                                              };
                                                              console.log(
                                                                updatedVariation,
                                                              );
                                                            }}
                                                            defaultValue={
                                                              variation[
                                                              fieldInfo.name
                                                              ] || ""
                                                            }
                                                            name={
                                                              fieldInfo.name
                                                            }
                                                            className="resize-none h-32"
                                                          />
                                                        )}
                                                      </div>
                                                    ),
                                                  )}
                                                </AccordionContent>
                                              </AccordionItem>
                                            ),
                                          )}
                                        </Accordion>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                {tab.fields &&
                                  tab.fields.map((fieldInfo) => (
                                    <>
                                      <div
                                        key={`${fieldInfo.name}`}
                                        className={`${fieldInfo.colSpan} ${(fieldInfo.name ===
                                          "sold_individually" ||
                                          fieldInfo.name ===
                                          "shipping_class") &&
                                          "border-t pt-4"
                                          }`}
                                      >
                                        <div className="flex items-start gap-2">
                                          <Label
                                            className={`${errorMessages[fieldInfo.name] &&
                                              "text-accent"
                                              } flex items-center gap-1 pb-1 max-w-[200px] w-full line-clamp-2`}
                                            htmlFor={fieldInfo.name}
                                          >
                                            {fieldInfo.label}{" "}
                                            {fieldInfo.required && (
                                              <span className="text-accent">
                                                *
                                              </span>
                                            )}
                                          </Label>

                                          {fieldInfo.type === "check" ? (
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                onCheckedChange={(value) => {
                                                  setFormData(
                                                    (prevFormData) => ({
                                                      ...prevFormData,
                                                      [fieldInfo.name]: value,
                                                    }),
                                                  );
                                                }}
                                                defaultChecked={
                                                  formData[fieldInfo.name]
                                                }
                                                id={`${fieldInfo.name}-${fieldInfo.type}`}
                                              />
                                              <label
                                                htmlFor={`${fieldInfo.name}-${fieldInfo.type}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                {fieldInfo.text}
                                              </label>
                                            </div>
                                          ) : fieldInfo.type === "radio" ? (
                                            <RadioGroup
                                              onValueChange={(value) => {
                                                setFormData((prevFormData) => ({
                                                  ...prevFormData,
                                                  [fieldInfo.name]: value,
                                                }));
                                              }}
                                              defaultValue={
                                                formData[fieldInfo.name]
                                              }
                                            >
                                              {fieldInfo.options &&
                                                fieldInfo.options.map(
                                                  (option) => (
                                                    <div
                                                      key={option.value}
                                                      className="flex items-center space-x-2"
                                                    >
                                                      <RadioGroupItem
                                                        value={option.value}
                                                        id={option.value}
                                                      />
                                                      <Label
                                                        htmlFor={option.value}
                                                      >
                                                        {option.label}
                                                      </Label>
                                                    </div>
                                                  ),
                                                )}
                                            </RadioGroup>
                                          ) : fieldInfo.type === "select" ? (
                                            <Select
                                              onValueChange={(value) => {
                                                setFormData((prevFormData) => ({
                                                  ...prevFormData,
                                                  [fieldInfo.name]: value,
                                                }));
                                              }}
                                              defaultValue={
                                                formData[fieldInfo.name] ||
                                                "any"
                                              }
                                            >
                                              <SelectTrigger className="w-[400px]">
                                                <SelectValue placeholder="Tipo de clase de envio" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {fieldInfo.search && (
                                                  <div className="flex items-center w-full max-w-md">
                                                    <div className="border-y border-l h-10 w-10 flex justify-center items-center rounded-l-lg">
                                                      <FaSearch />
                                                    </div>
                                                    <Input
                                                      className="rounded-none border-x-0 border-y focus-visible:ring-0 px-0 h-10"
                                                      type="text"
                                                      placeholder="Buscar..."
                                                      onChange={
                                                        handleSearchChange
                                                      }
                                                      value={
                                                        filters.products || ""
                                                      }
                                                    />
                                                    <div
                                                      className="border-y border-r h-10 w-10 flex justify-center items-center rounded-r-lg cursor-pointer"
                                                      onClick={
                                                        handleClearSearch
                                                      }
                                                    >
                                                      <IoClose />
                                                    </div>
                                                  </div>
                                                )}

                                                {fieldInfo.options &&
                                                  fieldInfo.options.map(
                                                    (option) => (
                                                      <SelectItem
                                                        value={option.formdata}
                                                      >
                                                        {option.label}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                              </SelectContent>
                                            </Select>
                                          ) : fieldInfo.type === "options" ? (
                                            <>
                                              <Button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  setFormData(
                                                    (prevFormData) => ({
                                                      ...prevFormData,
                                                      [fieldInfo.name]:
                                                        !prevFormData[
                                                        fieldInfo.name
                                                        ],
                                                    }),
                                                  );
                                                }}
                                                type="button"
                                                className="p-0 h-0"
                                                variant={"link"}
                                              >
                                                {formData[fieldInfo.name]
                                                  ? "Cancelar"
                                                  : "Programar"}
                                              </Button>
                                            </>
                                          ) : fieldInfo.type === "date" ? (
                                            <>
                                              {fieldInfo.name ===
                                                "date_on_sale_from" ? (
                                                <>
                                                  <Popover>
                                                    <PopoverTrigger asChild>
                                                      <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                          "w-[280px] justify-start text-left font-normal",
                                                          !rebajaInicio &&
                                                          "text-muted-foreground",
                                                        )}
                                                      >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {rebajaInicio ? (
                                                          format(
                                                            rebajaInicio,
                                                            "PPP",
                                                          )
                                                        ) : (
                                                          <span>
                                                            Pick a date
                                                          </span>
                                                        )}
                                                      </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                      <Calendar
                                                        mode="single"
                                                        selected={rebajaInicio}
                                                        onSelect={
                                                          setRebajaInicio
                                                        }
                                                        initialFocus
                                                      />
                                                    </PopoverContent>
                                                  </Popover>
                                                </>
                                              ) : (
                                                <>
                                                  <Popover>
                                                    <PopoverTrigger asChild>
                                                      <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                          "w-[280px] justify-start text-left font-normal",
                                                          !rebajaFin &&
                                                          "text-muted-foreground",
                                                        )}
                                                      >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {rebajaFin ? (
                                                          format(
                                                            rebajaFin,
                                                            "PPP",
                                                          )
                                                        ) : (
                                                          <span>
                                                            Pick a date
                                                          </span>
                                                        )}
                                                      </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                      <Calendar
                                                        mode="single"
                                                        selected={rebajaFin}
                                                        onSelect={setRebajaFin}
                                                        initialFocus
                                                      />
                                                    </PopoverContent>
                                                  </Popover>
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {fieldInfo.name ===
                                                "dimensions" ? (
                                                <div className="flex items-center gap-2 max-w-[400px] w-full">
                                                  {fieldInfo?.options &&
                                                    fieldInfo?.options.map(
                                                      (option) => (
                                                        <Input
                                                          key={option.formdata.toLowerCase()}
                                                          id={option.formdata.toLowerCase()}
                                                          type={fieldInfo.type}
                                                          onChange={(event) => {
                                                            const value =
                                                              event.target
                                                                .value;
                                                            setFormData(
                                                              (
                                                                prevFormData,
                                                              ) => ({
                                                                ...prevFormData,
                                                                dimensions: {
                                                                  ...prevFormData.dimensions,
                                                                  [option.formdata]:
                                                                    value,
                                                                },
                                                              }),
                                                            );
                                                            validateField(
                                                              option.formdata,
                                                              value,
                                                            );
                                                          }}
                                                          value={
                                                            formData.dimensions[
                                                            option.formdata
                                                            ] || ""
                                                          }
                                                          name={option.formdata.toLowerCase()}
                                                          placeholder={
                                                            option.label
                                                          }
                                                        />
                                                      ),
                                                    )}
                                                </div>
                                              ) : (
                                                <>
                                                  {fieldInfo.type === "text" ||
                                                    fieldInfo.type ===
                                                    "number" ? (
                                                    <>
                                                      <Input
                                                        id={fieldInfo.name}
                                                        type={fieldInfo.type}
                                                        onChange={(event) => {
                                                          const value =
                                                            event.target.value;
                                                          setFormData(
                                                            (prevFormData) => ({
                                                              ...prevFormData,
                                                              [fieldInfo.name]:
                                                                value,
                                                            }),
                                                          );
                                                          validateField(
                                                            fieldInfo.name,
                                                            value,
                                                          );
                                                        }}
                                                        value={
                                                          formData[
                                                          fieldInfo.name
                                                          ] || ""
                                                        }
                                                        name={fieldInfo.name}
                                                        className="max-w-[400px]"
                                                      />
                                                    </>
                                                  ) : (
                                                    <Textarea
                                                      id={fieldInfo.name}
                                                      onChange={(event) => {
                                                        const value =
                                                          event.target.value;
                                                        setFormData(
                                                          (prevFormData) => ({
                                                            ...prevFormData,
                                                            [fieldInfo.name]:
                                                              value,
                                                          }),
                                                        );
                                                        validateField(
                                                          fieldInfo.name,
                                                          value,
                                                        );
                                                      }}
                                                      value={
                                                        formData[
                                                        fieldInfo.name
                                                        ] || ""
                                                      }
                                                      name={fieldInfo.name}
                                                      className="resize-none h-20 w-96"
                                                    />
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}

                                          {errorMessages[fieldInfo.name] && (
                                            <p className="text-accent text-xs">
                                              {errorMessages[fieldInfo.name]}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ))}
                              </>
                            )}
                          </TabsContent>
                        ))}
                      </div>
                    </Tabs>
                  </div>
                ) : data?.title === "Detalles adicionales" ? (
                  <></>
                ) : (
                  <>
                    {data.fields.map((fieldInfo) => (
                      <div
                        key={`${fieldInfo.name}`}
                        className={fieldInfo.colSpan}
                      >
                        <div>
                          <Label
                            className={`${errorMessages[fieldInfo.name] && "text-accent"
                              } flex items-center gap-1 pb-1`}
                            htmlFor={fieldInfo.name}
                          >
                            {fieldInfo.label}{" "}
                            {fieldInfo.required && (
                              <span className="text-accent">*</span>
                            )}{" "}
                          </Label>

                          {fieldInfo.type === "text" ? (
                            <>
                              <Input
                                id={fieldInfo.name}
                                type={fieldInfo.type}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    [fieldInfo.name]: value,
                                  }));
                                  validateField(fieldInfo.name, value);
                                }}
                                value={formData[fieldInfo.name] || ""}
                                name={fieldInfo.name}
                              />
                            </>
                          ) : (
                            <>
                              {/*<div className="min-h-96">
                                <div className="min-h-96 !h-auto rounded-lg border bg-background shadow">
                                  <PlateEditor />
                                </div>
                              </div>*/}

                              <Textarea
                                id={fieldInfo.name}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    [fieldInfo.name]: value,
                                  }));
                                  validateField(fieldInfo.name, value);
                                }}
                                value={formData[fieldInfo.name] || ""}
                                name={fieldInfo.name}
                                className={"h-52 resize-none w-full"}
                              />
                            </>
                          )}

                          {errorMessages[fieldInfo.name] && (
                            <p className="text-accent text-xs">
                              {errorMessages[fieldInfo.name]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}

            {/* <div className="grid grid-cols-2 min-[1400px]:grid-cols-3 gap-3 rounded-md mt-5 bg-white p-3 shadow">
              <h4 className={`col-span-2 min-[1400px]:col-span-3 border-b`}>
                Imagenes
              </h4>

              <div className="col-span-2 min-[1400px]:col-span-3 grid min-[1740px]:grid-cols-3 gap-3">
                <ImageUpload files={files} setFiles={setFiles} />
              </div>
            </div>*/}
          </div>

          <div className="flex flex-col gap-4 mt-5 w-96">
            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Publicar</h3>

                <div className="flex flex-col gap-2 ">
                  <div className="flex items-center gap-2 text-[13px]">
                    <BsPinFill /> <span>Estado: Borrador</span>{" "}
                    <Button
                      type="button"
                      className="p-0 h-0 text-[13px]"
                      variant={"link"}
                    >
                      editar
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <BsPinFill /> <span>Visibilidad: Pública</span>{" "}
                    <Button
                      type="button"
                      className="p-0 h-0 text-[13px]"
                      variant={"link"}
                    >
                      editar
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <BsPinFill /> <span>Publicar inmediatamente</span>{" "}
                    <Button
                      type="button"
                      className="p-0 h-0 text-[13px]"
                      variant={"link"}
                    >
                      editar
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <span>
                      Visibilidad catálogo: En la tienda y en los resultados de
                      búsqueda
                      <Button
                        type="button"
                        className=" ml-1 p-0 h-0 text-[13px]"
                        variant={"link"}
                      >
                        editar
                      </Button>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t">
                <div className="w-full pt-1 flex justify-between">
                  <Button type="button" variant={"outline"}>
                    Guardar borrador
                  </Button>
                  <Button>Publicar</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Imagen principal</h3>

                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropzone}
                  className="flex flex-col gap-2"
                >
                  <div>
                    {hasFiles ? (
                      <>
                        <img
                          onClick={() => handleImageClick(files[0])}
                          className="w-full object-cover aspect-square rounded-lg cursor-pointer"
                          src={URL?.createObjectURL(files[0])}
                          alt=""
                        />
                      </>
                    ) : (
                      <FileInput className="w-full aspect-square flex items-center justify-center text-center border-2 rounded-lg border-dashed border-accent/50">
                        <div className="flex items-center justify-center text-center flex-col">
                          <svg
                            className="w-8 h-8 mb-3 text-accent/70 dark:text-accent/70"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            ></path>
                          </svg>
                          <p className="mb-1 text-sm text-accent/70 dark:text-accent/70">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-accent/70 dark:text-accent/70">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </FileInput>
                    )}
                  </div>
                  <FileUploaderContent>
                    {files &&
                      files.map((item: any, index: any) => (
                        <FileUploaderItem
                          className="group"
                          key={index}
                          index={index}
                        >
                          <span className="truncate max-w-52">{item.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </div>
            </div>

            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Galeria de imagenes</h3>

                <Sheet>
                  <SheetTrigger
                    className={`${buttonVariants({ variant: "outline" })}`}
                  >
                    Abrir galeria
                  </SheetTrigger>
                  <SheetContent className="bg-white !max-w-2xl h-full overflow-auto">
                    <SheetHeader>
                      <SheetTitle>Galeria</SheetTitle>
                      <SheetDescription className="">
                        <FileUploader
                          value={filesGallery}
                          onValueChange={setFilesGallery}
                          dropzoneOptions={dropzoneGallery}
                          className="flex flex-col gap-2"
                        >
                          <div>
                            <FileInput className="w-full aspect-[4/1.5] flex items-center justify-center text-center border-2 rounded-lg border-dashed border-accent/50">
                              <div className="flex items-center justify-center text-center flex-col">
                                <svg
                                  className="w-8 h-8 mb-3 text-accent/70 dark:text-accent/70"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  ></path>
                                </svg>
                                <p className="mb-1 text-xs text-accent/70 dark:text-accent/70">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>
                                  &nbsp; or drag and drop{" "}
                                  <span className="text-xs text-accent/70 dark:text-accent/70">
                                    SVG, PNG, JPG or GIF
                                  </span>
                                </p>
                              </div>
                            </FileInput>
                          </div>
                        </FileUploader>

                        <SheetTitle className="text-black mt-3">
                          Lista de galeria
                        </SheetTitle>

                        <ReactSortable
                          className="grid grid-cols-3 gap-3 mt-3"
                          //@ts-ignore
                          list={filesGallery}
                          //@ts-ignore
                          setList={setFilesGallery}
                          handle=".draggable"
                        >
                          {filesGallery &&
                            filesGallery.map((item: any, index: any) => (
                              <img
                                /*  onClick={() => handleImageClick(item)} */
                                className="w-full object-cover aspect-square rounded-lg cursor-pointer draggable"
                                src={URL?.createObjectURL(item)}
                                alt=""
                              />
                            ))}
                        </ReactSortable>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Categorias</h3>
                <div
                  className={
                    "flex flex-col gap-2 max-h-44 pb-1 h-full overflow-auto"
                  }
                >
                  {categories &&
                    categories.length > 0 &&
                    categories?.map((category) => (
                      <div
                        key={category.id}
                        className={"flex items-center gap-1.5"}
                      >
                        <Checkbox
                          checked={selectedCategories.some(
                            (selectedCategory) =>
                              selectedCategory.id === category.id,
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories(
                                (prevSelectedCategories) => [
                                  ...prevSelectedCategories,
                                  category,
                                ],
                              );
                            } else {
                              setSelectedCategories((prevSelectedCategories) =>
                                prevSelectedCategories.filter(
                                  (selectedCategory) =>
                                    selectedCategory.id !== category.id,
                                ),
                              );
                            }
                          }}
                          id={category.id}
                          // @ts-ignore
                          label={category.name}
                          onChange={(e) => {
                            // @ts-ignore
                            console.log(e.target.checked);
                          }}
                        />
                        <Label htmlFor={category.id}>{category.name}</Label>
                      </div>
                    ))}
                </div>
                <Button
                  onClick={() => {
                    setNewCategory(!newCategory);
                    setNewCategoryName("");
                    setParentCategory("none");
                    setShowParentCategory(null);
                  }}
                  variant={"outline"}
                  className={""}
                  type={"button"}
                >
                  {newCategory ? "Cancelar" : "Agregar nueva"}
                </Button>
                {newCategory && (
                  <>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-md">
                        {/* @ts-ignore */}
                        <Label forHtml="createCategory">
                          Nombre de la nueva categoría
                        </Label>
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          id={"createCategory"}
                          name={"createCategory"}
                          placeholder={""}
                        />
                      </div>
                      <div className="text-md">
                        <Label>Categoría padre</Label>
                        <Select
                          onValueChange={(value) => {
                            setParentCategory(value);
                            if (value === "none") {
                              setShowParentCategory(null);
                            } else {
                              const selectedCategory = findCategoryById(
                                value,
                                categories,
                              );
                              console.log(selectedCategory);
                              setShowParentCategory(selectedCategory);
                            }
                          }}
                          defaultValue="none"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione la categoría padre">
                              {showParentCategory
                                ? showParentCategory.name
                                : "Seleccione la categoría padre"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Ninguna</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className={"mt-2"}>
                        <Button
                          onClick={handleAddCategory}
                          type={"button"}
                          variant={"secondary"}
                          className={"w-full"}
                        >
                          Agregar categoría
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Etiquetas</h3>
                <div
                  className={
                    "flex flex-col gap-2 max-h-44 pb-1 h-full overflow-auto"
                  }
                >
                  {tags &&
                    tags.length > 0 &&
                    tags?.map((tag) => (
                      <div key={tag.id} className={"flex items-center gap-1.5"}>
                        <Checkbox
                          checked={selectedTags.some(
                            (selectedTag) => selectedTag.id === tag.id,
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags((prevSelectedTags) => [
                                ...prevSelectedTags,
                                tag,
                              ]);
                            } else {
                              setSelectedTags((prevSelectedTags) =>
                                prevSelectedTags.filter(
                                  (selectedTag) => selectedTag.id !== tag.id,
                                ),
                              );
                            }
                          }}
                          id={tag.id}
                          // @ts-ignore
                          label={tag.name}
                          onChange={(e) => {
                            // @ts-ignore
                            console.log(e.target.checked);
                          }}
                        />
                        <Label htmlFor={tag.id}>{tag.name}</Label>
                      </div>
                    ))}
                </div>
                <Button
                  onClick={() => {
                    setNewTag(!newTag);
                    // @ts-ignore
                    setNewTagName("");
                  }}
                  variant={"outline"}
                  className={""}
                  type={"button"}
                >
                  {newTag ? "Cancelar" : "Agregar nueva"}
                </Button>
                {newTag && (
                  <>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className={"text-md"}>
                        {/* @ts-ignore */}
                        <Label forHtml={"newTag"}>
                          Nombre de la nueva categoría
                        </Label>
                        <Input
                          value={newTagName}
                          // @ts-ignore
                          onChange={(e) => setNewTagName(e.target.value)}
                          id={"newTag"}
                          name={"newTag"}
                          placeholder={""}
                        />
                      </div>
                      <div className={"mt-2"}>
                        <Button
                          onClick={handleAddTag}
                          type={"button"}
                          variant={"secondary"}
                          className={"w-zfull"}
                        >
                          Agregar etiqueta
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      </form>
    </>
  );
};

export default CreateForm;
