'use client';

/* React */
import React, { FormEvent, useEffect, useState } from 'react';
import { BsPinFill } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
/* import axios from "axios"; */

/* Shadcn */
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
/* import Pagination from "../shared/pagination"; */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PlateEditor from '../plate-editor';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { ImageUpload } from './image-upload';

interface Props {}

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

const CreateForm: React.FC<Props> = () => {
  const [editadData, setEditadData] = useState<any | null>(null);
  const [isEditedPropety, setIsEditedPropety] = useState<boolean>(false);

  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  const [productType, setProductType] = useState('simple');
  const [existingAttribute, setExistingAttribute] = useState('');
  const [attributes, setAttributes] = useState<any>([]);
  const [variations, setVariations] = useState<any>(null);
  const [files, setFiles] = useState<File[] | null>([]);

  const [filters, setFilters] = useState({
    products: null,
  });

  const tabs = [
    {
      value: 'general',
      label: 'General',
      condition: (data: any) =>
        data.type === 'simple' || data.type === 'external',
    },
    { value: 'inventory', label: 'Inventario', condition: () => true },
    {
      value: 'shipping',
      label: 'Envío',
      condition: (data: any) =>
        data.type === 'simple' || data.type === 'variable',
    },
    {
      value: 'related-products',
      label: 'Productos relacionados',
      condition: () => true,
    },
    { value: 'attributes', label: 'Atributos', condition: () => true },
    {
      value: 'variations',
      label: 'Variaciones',
      condition: (data: any) => data.type === 'variable',
    },
    { value: 'advanced', label: 'Avanzado', condition: () => true },
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
    reserves: 'option-no',
    name: '',
    description: '',
    short_description: '',
    sku: '',
    code: '',
    sold_individually: false,
    stock_quantity: 0,
    low_existens: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    program: false,
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
    {}
  );

  let fieldsDataTypeSimple: Section[] = [
    {
      title: 'Datos principales',
      fields: [
        {
          name: 'name',
          label: 'Nombre del producto',
          colSpan: 'col-span-2 min-[720px]:col-span-1 min-[1400px]:col-span-2',
          type: 'text',
          min: 3,
        },
        {
          name: 'slug',
          label: 'Slug',
          colSpan: 'col-span-2 min-[720px]:col-span-1',
          type: 'text',
          min: 3,
        },
        {
          name: 'description',
          label: 'Descripcion del producto',
          colSpan: 'col-span-2 min-[1400px]:col-span-3',
          type: 'textarea',
          max: 500,
        },
        {
          name: 'short_description',
          label: 'Descripcion corta del producto',
          colSpan: 'col-span-2 min-[1400px]:col-span-3',
          type: 'textarea',
          max: 250,
        },
      ],
    },
    {
      title: 'Datos del producto',
      type: productType,
      tabs: [
        {
          id: 1,
          value: 'general',
          fields: [
            {
              name: 'price',
              label: 'Precio normal ($)',
              colSpan: 'col-span-1',
              type: 'number',
            },
            {
              name: 'discounted_price',
              label: 'Precio rebajado ($)',
              colSpan: 'col-span-1',
              type: 'number',
            },

            {
              name: 'date_on_sale_from',
              label: 'Fechas del precio rebajado',
              colSpan: 'col-span-1',
              type: 'date',
              actions: 'general-view-program',
            },
            {
              name: 'date_on_sale_to',
              label: '',
              colSpan: 'col-span-1',
              type: 'date',
              actions: 'general-view-program',
            },
            {
              name: 'program',
              label: '',
              colSpan: 'col-span-1',
              type: 'options',
              actions: 'general-view-program',
            },
          ],
        },
        {
          id: 2,
          value: 'inventory',
          fields: [
            {
              name: 'sku',
              label: 'SKU',
              colSpan: 'col-span-1',
              type: 'text',
            },
            {
              name: 'code',
              label: 'GTIN, UPC, EAN o ISBN',
              colSpan: 'col-span-1',
              type: 'text',
            },
            {
              name: 'inventory_management',
              label: 'Gestión de inventario',
              colSpan: 'col-span-1',
              type: 'check',
              text: 'Hacer seguimiento de la cantidad de inventario de este producto',
            },

            {
              name: 'stock_quantity',
              label: 'Cantidad',
              colSpan: 'col-span-1',
              type: 'number',
            },
            {
              name: 'reserves',
              label: '¿Permitir reservas?',
              colSpan: 'col-span-1',
              type: 'radio',
              options: [
                { label: 'No permitir', value: 'option-no' },
                {
                  label: 'Permitir, pero se avisará al cliente',
                  value: 'option-allow-warning',
                },
                { label: 'Permitir', value: 'option-allow' },
              ],
            },
            {
              name: 'low_existens',
              label: 'Umbral de pocas existencias',
              colSpan: 'col-span-1',
              type: 'number',
            },
            {
              name: 'sold_individually',
              label: 'Vendido individualmente',
              colSpan: 'col-span-1',
              type: 'check',
              text: 'Limitar compras a 1 artículo por pedido',
            },
          ],
        },
        {
          id: 3,
          value: 'shipping',
          fields: [
            {
              name: 'weight',
              label: 'Peso (kg)',
              colSpan: 'col-span-1',
              type: 'number',
            },
            {
              name: 'dimensions',
              label: 'Dimensiones (cm)',
              colSpan: 'col-span-1',
              type: 'text',
              options: [
                {
                  label: 'Longitud',
                  formdata: 'length',
                },
                {
                  label: 'Ancho',
                  formdata: 'width',
                },
                {
                  label: 'Alto',
                  formdata: 'height',
                },
              ],
            },
            {
              name: 'shipping_class',
              label: 'Clase de envío',
              colSpan: 'col-span-1',
              type: 'select',
              options: [
                {
                  label: 'Ninguna clase de envio',
                  formdata: 'any',
                },
                {
                  label: 'Correo argentino',
                  formdata: 'correo_argentino',
                },
                {
                  label: 'Andreani',
                  formdata: 'andreani',
                },
              ],
            },
          ],
        },
        {
          id: 4,
          value: 'related-products',
          fields: [
            {
              name: 'targeted_sales',
              label: 'Ventas dirigidas',
              colSpan: 'col-span-1',
              type: 'select',
              search: true,
            },
            {
              name: 'cross_selling',
              label: 'Ventas cruzadas',
              colSpan: 'col-span-1',
              type: 'select',
              search: true,
            },
          ],
        },
        {
          id: 5,
          value: 'attributes',
          fields: [],
        },
        {
          id: 5,
          value: 'variations',
          fields: [],
        },
        {
          id: 6,
          value: 'advanced',
          fields: [
            {
              name: 'purchase_note',
              label: 'Nota de compra',
              colSpan: 'col-span-1',
              type: 'textarea',
            },
            {
              name: 'order_on_the_menu',
              label: 'Orden en el menú',
              colSpan: 'col-span-1',
              type: 'textarea',
            },
            {
              name: 'activate_reviews',
              label: 'Activa las valoraciones',
              colSpan: 'col-span-1',
              type: 'check',
            },
          ],
        },
      ],
    },
  ];

  if (formData['inventory_management'] !== true) {
    fieldsDataTypeSimple = fieldsDataTypeSimple.map((section: any) => {
      if (section.title === 'Datos del producto') {
        return {
          ...section,
          tabs: section.tabs.map((tab: any) => ({
            ...tab,
            fields: tab.fields.filter(
              (field: any) =>
                field.name !== 'stock_quantity' &&
                field.name !== 'reserves' &&
                field.name !== 'low_existens'
            ),
          })),
        };
      }
      return section;
    });
  }

  if (formData['program'] !== true) {
    fieldsDataTypeSimple = fieldsDataTypeSimple.map((section: any) => {
      if (section.title === 'Datos del producto') {
        return {
          ...section,
          tabs: section.tabs.map((tab: any) => ({
            ...tab,
            fields: tab.fields.filter(
              (field: any) =>
                field.name !== 'date_on_sale_from' &&
                field.name !== 'date_on_sale_to'
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
      if ('fields' in section) {
        field = section.fields.find((f) => f.name === name);
      } else if ('tabs' in section) {
        section.tabs.some((tab) => {
          field = tab.fields.find((f) => f.name === name);
          return !!field;
        });
      }
      return !!field;
    });

    if (field) {
      if (field.required && !value) {
        newErrorMessages[name] = 'Por favor, complete el campo.';
      } else if (field.min && value.length < field.min) {
        newErrorMessages[name] =
          `Por favor, ingrese al menos ${field.min} caracteres.`;
      } else if (field.max && value.length > field.max) {
        newErrorMessages[name] =
          `Por favor, ingrese como máximo ${field.max} caracteres.`;
      } else if (field.type === 'number' && value) {
        if (!value) {
          newErrorMessages[name] = 'Por favor, ingrese un número.';
        } else if (isNaN(Number(value))) {
          newErrorMessages[name] = 'Debe ser un número válido.';
        } else if (Number(value) < 0) {
          newErrorMessages[name] = 'Debe ser un número no negativo.';
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoadingForm(true);

    const validateData = validateForm();

    setTimeout(() => {
      setLoadingForm(false);
    }, 5000);
  };

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      products: value !== '' ? value : null,
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
          console.log('first');
        }
      });
    });
  }, [attributes]);

  return (
    <>
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
              <SelectItem value={'simple'}>Producto simple</SelectItem>
              <SelectItem value={'agruped'}>Producto agrupado</SelectItem>
              <SelectItem value={'external'}>
                Producto externo/afiliado
              </SelectItem>
              <SelectItem value={'variable'}>Producto variable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form className={"flex gap-4"} onSubmit={handleSubmit}>
        <>
          <div>
            {fieldsDataTypeSimple.map((data, index) => (
              <div className="grid grid-cols-2 min-[1400px]:grid-cols-3 gap-3 rounded-md mt-5 bg-white p-3 shadow">
                <h4 className={`col-span-2 min-[1400px]:col-span-3 border-b`}>
                  {data.title}
                </h4>

                {'type' in data ? (
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
                            )
                        )}
                      </TabsList>

                      <div className="!w-full h-full p-3">
                        {data.tabs.map((tab) => (
                          <TabsContent
                            key={tab.value}
                            className="!w-full grid gap-y-5 gap-x-3 m-0"
                            value={tab.value || ''}
                          >
                            {tab.value === 'attributes' ? (
                              <div className=" w-full">
                                <div className="w-full flex items-center gap-2 pb-3">
                                  <Button
                                    variant={'outline'}
                                    onClick={() => {
                                      setAttributes((prev: any) => [
                                        ...prev,
                                        {
                                          id: Date.now(),
                                          name: '',
                                          options: [
                                            {
                                              id: Date.now(),
                                              name: 'Valor 1',
                                              value: '',
                                            },
                                          ],
                                          visible: false,
                                          save: false,
                                        },
                                      ]);
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
                                      <SelectItem value={'colors'}>
                                        Colores
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex flex-col gap-3">
                                  {attributes && attributes.length !== 0 && (
                                    <>
                                      {attributes.map(
                                        (attribute: any, attrIndex: number) => (
                                          <div
                                            className="relative p-2 border rounded-md"
                                            key={attribute?.id}
                                          >
                                            <div className="absolute right-2 flex items-center gap-2">
                                              <Button
                                                variant={'outline'}
                                                onClick={() => {
                                                  setAttributes((prev: any) =>
                                                    prev.map(
                                                      (
                                                        attr: any,
                                                        index: number
                                                      ) => {
                                                        if (
                                                          index === attrIndex
                                                        ) {
                                                          return {
                                                            ...attr,
                                                            options: [
                                                              ...attr.options,
                                                              {
                                                                id: Date.now(),
                                                                name: `Valor ${
                                                                  attr.options
                                                                    .length + 1
                                                                }`,
                                                                value: '',
                                                                save: false,
                                                              },
                                                            ],
                                                          };
                                                        }
                                                        return attr;
                                                      }
                                                    )
                                                  );
                                                }}
                                                className="bg-transparent hidden sm:block border-secondary h-8 py-0 hover:text-secondary px-5 text-secondary hover:bg-secondary/10"
                                                type="button"
                                              >
                                                Agregar valor
                                              </Button>

                                              <Button
                                                variant={'outline'}
                                                onClick={() => {
                                                  setAttributes((prev: any) =>
                                                    prev.filter(
                                                      (_: any, index: number) =>
                                                        index !== attrIndex
                                                    )
                                                  );
                                                }}
                                                className="bg-transparent hidden sm:block border-accent h-8 py-0 hover:text-accent px-5 text-accent hover:bg-accent/10"
                                                type="button"
                                              >
                                                Eliminar Atributo
                                              </Button>
                                            </div>

                                            <div className="absolute right-2 bottom-2 flex items-center gap-2">
                                              <Button
                                                variant={'secondary'}
                                                onClick={() => {
                                                  setAttributes((prev: any) =>
                                                    prev.map(
                                                      (
                                                        attr: any,
                                                        index: number
                                                      ) => {
                                                        if (
                                                          index === attrIndex
                                                        ) {
                                                          return {
                                                            ...attr,
                                                            save: true,
                                                          };
                                                        }
                                                        return attr;
                                                      }
                                                    )
                                                  );
                                                }}
                                                className="px-10"
                                                type="button"
                                              >
                                                Guardar
                                              </Button>
                                            </div>

                                            <div>
                                              <Label
                                                className={`${
                                                  errorMessages[
                                                    attribute?.id
                                                  ] && 'text-accent'
                                                } flex items-center gap-1 pb-1`}
                                                htmlFor={attribute?.name}
                                              >
                                                Nombre
                                              </Label>

                                              <Input
                                                id={attribute?.name}
                                                type={attribute?.type}
                                                onChange={(event) => {
                                                  const value =
                                                    event.target.value;

                                                  setAttributes((prev: any) =>
                                                    prev.map(
                                                      (
                                                        attr: any,
                                                        index: number
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
                                                      }
                                                    )
                                                  );

                                                  validateField(
                                                    attribute?.name,
                                                    value
                                                  );
                                                }}
                                                value={attribute?.name || ''}
                                                name={attribute?.name}
                                                className="max-w-[400px]"
                                              />

                                              {errorMessages[attribute?.id] && (
                                                <p className="text-accent text-xs">
                                                  {errorMessages[attribute?.id]}
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
                                                    option: any,
                                                    optIndex: number
                                                  ) => (
                                                    <div
                                                      key={optIndex}
                                                      className="relative"
                                                    >
                                                      <Input
                                                        key={option.id}
                                                        id={option.name}
                                                        type="text"
                                                        onChange={(event) => {
                                                          const value =
                                                            event.target.value;
                                                          setAttributes(
                                                            (prev: any) =>
                                                              prev.map(
                                                                (
                                                                  attr: any,
                                                                  index: number
                                                                ) => {
                                                                  if (
                                                                    index ===
                                                                    attrIndex
                                                                  ) {
                                                                    const updatedOptions =
                                                                      attr.options.map(
                                                                        (
                                                                          opt: any,
                                                                          i: number
                                                                        ) => {
                                                                          if (
                                                                            i ===
                                                                            optIndex
                                                                          ) {
                                                                            return {
                                                                              ...opt,
                                                                              value,
                                                                            };
                                                                          }
                                                                          return opt;
                                                                        }
                                                                      );
                                                                    return {
                                                                      ...attr,
                                                                      options:
                                                                        updatedOptions,
                                                                    };
                                                                  }
                                                                  return attr;
                                                                }
                                                              )
                                                          );
                                                        }}
                                                        value={option.value}
                                                        name={option.name}
                                                        className="max-w-[400px]"
                                                        placeholder={
                                                          option.name
                                                        }
                                                      />
                                                      <IoClose
                                                        className="text-accent absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                        onClick={() => {
                                                          setAttributes(
                                                            (prev: any) =>
                                                              prev.map(
                                                                (
                                                                  attr: any,
                                                                  index: number
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
                                                                            o: any
                                                                          ) =>
                                                                            o.id !==
                                                                            option.id
                                                                        ),
                                                                    };
                                                                  }
                                                                  return attr;
                                                                }
                                                              )
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>

                                            <div className="flex items-center space-x-2 pt-3">
                                              <Checkbox
                                                onCheckedChange={(checked) => {
                                                  setAttributes((prev: any) =>
                                                    prev.map(
                                                      (
                                                        attr: any,
                                                        index: number
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
                                                      }
                                                    )
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
                                                Visible en la pagina de
                                                productos
                                              </label>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : tab.value === 'variations' ? (
                              <>
                                <div className="w-full h-[198px] flex justify-center flex-col text-center">
                                  {variations?.length === 0 ||
                                  variations === null ? (
                                    <p>
                                      Añade algunos atributos en la pestaña
                                      Atributos para generar variaciones.
                                      Asegúrate de marcar la casilla Usado para
                                      variaciones.
                                    </p>
                                  ) : null}
                                </div>
                              </>
                            ) : (
                              <>
                                {tab.fields &&
                                  tab.fields.map((fieldInfo) => (
                                    <>
                                      <div
                                        key={`${fieldInfo.name}`}
                                        className={`${fieldInfo.colSpan} ${
                                          (fieldInfo.name ===
                                            'sold_individually' ||
                                            fieldInfo.name ===
                                              'shipping_class') &&
                                          'border-t pt-4'
                                        }`}
                                      >
                                        <div className="flex items-start gap-2">
                                          <Label
                                            className={`${
                                              errorMessages[fieldInfo.name] &&
                                              'text-accent'
                                            } flex items-center gap-1 pb-1 max-w-[200px] w-full line-clamp-2`}
                                            htmlFor={fieldInfo.name}
                                          >
                                            {fieldInfo.label}{' '}
                                            {fieldInfo.required && (
                                              <span className="text-accent">
                                                *
                                              </span>
                                            )}
                                          </Label>

                                          {fieldInfo.type === 'check' ? (
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                onCheckedChange={(value) => {
                                                  setFormData(
                                                    (prevFormData) => ({
                                                      ...prevFormData,
                                                      [fieldInfo.name]: value,
                                                    })
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
                                          ) : fieldInfo.type === 'radio' ? (
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
                                                  )
                                                )}
                                            </RadioGroup>
                                          ) : fieldInfo.type === 'select' ? (
                                            <Select
                                              onValueChange={(value) => {
                                                setFormData((prevFormData) => ({
                                                  ...prevFormData,
                                                  [fieldInfo.name]: value,
                                                }));
                                              }}
                                              defaultValue={
                                                formData[fieldInfo.name] ||
                                                'any'
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
                                                        filters.products || ''
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
                                                    )
                                                  )}
                                              </SelectContent>
                                            </Select>
                                          ) : fieldInfo.type === 'options' ? (
                                            <>
                                              <Button
                                                onClick={() => {
                                                  setFormData(
                                                    (prevFormData) => ({
                                                      ...prevFormData,
                                                      [fieldInfo.name]:
                                                        !prevFormData[
                                                          fieldInfo.name
                                                        ],
                                                    })
                                                  );
                                                }}
                                                type="button"
                                                className="p-0 h-0"
                                                variant={'link'}
                                              >
                                                {formData[fieldInfo.name]
                                                  ? 'Cancelar'
                                                  : 'Programar'}
                                              </Button>
                                            </>
                                          ) : (
                                            <>
                                              {fieldInfo.name ===
                                              'dimensions' ? (
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
                                                                prevFormData
                                                              ) => ({
                                                                ...prevFormData,
                                                                dimensions: {
                                                                  ...prevFormData.dimensions,
                                                                  [option.formdata]:
                                                                    value,
                                                                },
                                                              })
                                                            );
                                                            validateField(
                                                              option.formdata,
                                                              value
                                                            );
                                                          }}
                                                          value={
                                                            formData.dimensions[
                                                              option.formdata
                                                            ] || ''
                                                          }
                                                          name={option.formdata.toLowerCase()}
                                                          placeholder={
                                                            option.label
                                                          }
                                                        />
                                                      )
                                                    )}
                                                </div>
                                              ) : (
                                                <>
                                                  {fieldInfo.type === 'text' ? (
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
                                                            })
                                                          );
                                                          validateField(
                                                            fieldInfo.name,
                                                            value
                                                          );
                                                        }}
                                                        value={
                                                          formData[
                                                            fieldInfo.name
                                                          ] || ''
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
                                                          })
                                                        );
                                                        validateField(
                                                          fieldInfo.name,
                                                          value
                                                        );
                                                      }}
                                                      value={
                                                        formData[
                                                          fieldInfo.name
                                                        ] || ''
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
                ) : data?.title === 'Detalles adicionales' ? (
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
                            className={`${
                              errorMessages[fieldInfo.name] && 'text-accent'
                            } flex items-center gap-1 pb-1`}
                            htmlFor={fieldInfo.name}
                          >
                            {fieldInfo.label}{' '}
                            {fieldInfo.required && (
                              <span className="text-accent">*</span>
                            )}{' '}
                          </Label>

                          {fieldInfo.type === 'text' ? (
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
                                value={formData[fieldInfo.name] || ''}
                                name={fieldInfo.name}
                              />
                            </>
                          ) : (
                            <div className="min-h-96">
                              <div className="min-h-96 !h-auto rounded-lg border bg-background shadow">
                                <PlateEditor />
                              </div>
                            </div>
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

            <div className="grid grid-cols-2 min-[1400px]:grid-cols-3 gap-3 rounded-md mt-5 bg-white p-3 shadow">
              <h4 className={`col-span-2 min-[1400px]:col-span-3 border-b`}>
                Imagenes
              </h4>

              <div className="col-span-2 min-[1400px]:col-span-3 grid min-[1740px]:grid-cols-3 gap-3">
                <ImageUpload files={files} setFiles={setFiles} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-5 w-96">
            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Publicar</h3>

                <div className="flex flex-col gap-2 ">
                  <div className="flex items-center gap-2 text-[13px]">
                    <BsPinFill /> <span>Estado: Borrador</span>{' '}
                    <Button
                      type="button"
                      className="p-0 h-0 text-[13px]"
                      variant={'link'}
                    >
                      editar
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <BsPinFill /> <span>Visibilidad: Pública</span>{' '}
                    <Button
                      type="button"
                      className="p-0 h-0 text-[13px]"
                      variant={'link'}
                    >
                      editar
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <BsPinFill /> <span>Publicar inmediatamente</span>{' '}
                    <Button
                      type="button"
                      className="p-0 h-0 text-[13px]"
                      variant={'link'}
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
                        variant={'link'}
                      >
                        editar
                      </Button>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t">
                <div className="w-full pt-1 flex justify-between">
                  <Button type="button" variant={'outline'}>
                    Guardar borrador
                  </Button>
                  <Button>Publicar</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow">
              <div className="flex flex-col gap-2 p-3">
                <h3>Categorias</h3>
              </div>
            </div>
          </div>
        </>
      </form>
    </>
  );
};

export default CreateForm;
