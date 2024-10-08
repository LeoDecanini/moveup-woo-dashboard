'use client';

/* React */
import React, { FormEvent, useEffect, useState } from 'react';
import { useWordpress } from '@/context/wordpress-context';
import axios from 'axios';
import { BsPinFill } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { ServerUrl } from '@/lib/utils';
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
import { ImageUpload } from '../shared/image-upload';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

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

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [parentCategory, setParentCategory] = useState<number | string>('none');
  const [showParentCategory, setShowParentCategory] = useState<any>('none');

  const { fetchCategories, fetchTags, addCategory, addTag } = useWordpress();
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newTagsName, setNewTagsName] = useState<any[]>([]);
  const [newTag, setNewTag] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);

  function findCategoryById(id, categories) {
    console.log({ id, categories });
    return categories.find((category) => category.id == id);
  }

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
    title: '',
    content: '',
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (editadData) {
      setIsEditedPropety(true);
      setFormData({
        /* Aca poner los parametros  */
      });
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
          name: 'title',
          label: 'Título de la entrada',
          colSpan: 'col-span-2 min-[1400px]:col-span-3',
          type: 'text',
          min: 3,
        },
        {
          name: 'content',
          label: 'Descripcion de la entrada',
          colSpan: 'col-span-2 min-[1400px]:col-span-3',
          type: 'textarea',
          max: 500,
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

  const extractTagIds = (selectedTags) => {
    return selectedTags.map((tag) => tag.id);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoadingForm(true);

    const validateData = validateForm();

    if (!validateData) {
      setLoadingForm(false);
      return;
    }

    formData.status = 'publish';
    formData.categories = extractTagIds(selectedCategories);
    formData.tags = extractTagIds(selectedTags);

    console.log({ formData });

    try {
      const response = await axios.post(
        `${ServerUrl}/wordpress/posts`,
        {
          userId: '66fcceab3f69e67d4843014a',
          post: formData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      // Capturar errores y mostrarlos en consola
      console.error('Error al crear el post:', error);
    } finally {
      // Detener la carga sin importar el resultado de la solicitud
      setLoadingForm(false);
    }
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

  console.log('parentCategory', parentCategory);

  const handleAddCategory = async () => {
    const parent = parentCategory === 'none' ? 0 : parentCategory;
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
      setNewCategoryName('');
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
      setNewTagName('');
    });
  };

  console.log({ selectedCategories });
  console.log({ selectedTags });

  return (
    <>
      <div className="bg-white rounded-md shadow flex flex-col">
        <div className="flex flex-col gap-3 min-[550px]:gap-0 min-[550px]:flex-row justify-between items-center w-full border-b p-3">
          <h1 className="text-2xl sm:text-4xl text-secondary font-semibold">
            Crear entrada
          </h1>
          {/* <Select
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
          </Select> */}
        </div>
      </div>

      <form className="flex gap-4" onSubmit={handleSubmit}>
        <div className="w-full">
          <>
            {fieldsDataTypeSimple.map((data, index) => (
              <div className="grid grid-cols-2 min-[1400px]:grid-cols-3 gap-3 rounded-md mt-5 bg-white p-3 shadow">
                <h4 className={`col-span-2 min-[1400px]:col-span-3 border-b`}>
                  {data.title}
                </h4>

                {/* @ts-ignore */}
                {data?.fields.map((fieldInfo) => (
                  <div key={`${fieldInfo.name}`} className={fieldInfo.colSpan}>
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
                          <div /* className="min-h-96 rounded-lg border bg-background shadow" */
                          >
                            {/* <PlateEditor /> */}
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
                              value={formData[fieldInfo.name] || ''}
                              name={fieldInfo.name}
                              className="min-h-96"
                            />
                          </div>
                        </div>
                      )}

                      {errorMessages[fieldInfo.name] && (
                        <p className="text-accent text-[13px]">
                          {errorMessages[fieldInfo.name]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
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
              <div
                className={
                  'flex flex-col gap-2 max-h-44 pb-1 h-full overflow-auto'
                }
              >
                {categories &&
                  categories.length > 0 &&
                  categories?.map((category) => (
                    <div
                      key={category.id}
                      className={'flex items-center gap-1.5'}
                    >
                      <Checkbox
                        checked={selectedCategories.some(
                          (selectedCategory) =>
                            selectedCategory.id === category.id
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories((prevSelectedCategories) => [
                              ...prevSelectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories((prevSelectedCategories) =>
                              prevSelectedCategories.filter(
                                (selectedCategory) =>
                                  selectedCategory.id !== category.id
                              )
                            );
                          }
                        }}
                        id={category.id}
                        label={category.name}
                        onChange={(e) => {
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
                  setNewCategoryName('');
                  setParentCategory('none');
                  setShowParentCategory(null);
                }}
                variant={'outline'}
                className={''}
                type={'button'}
              >
                {newCategory ? 'Cancelar' : 'Agregar nueva'}
              </Button>
              {newCategory && (
                <>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className={'text-md'}>
                      <Label forHtml={'createCategory'}>
                        Nombre de la nueva categoría
                      </Label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        id={'createCategory'}
                        name={'createCategory'}
                        placeholder={''}
                      />
                    </div>
                    <div className={'text-md'}>
                      <Label>Categoría padre</Label>
                      <Select
                        onValueChange={(value) => {
                          setParentCategory(value);
                          if (value === 'none') {
                            setShowParentCategory(null);
                          } else {
                            const selectedCategory = findCategoryById(
                              value,
                              categories
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
                              : 'Seleccione la categoría padre'}
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
                    <div className={'mt-2'}>
                      <Button
                        onClick={handleAddCategory}
                        type={'button'}
                        variant={'secondary'}
                        className={'w-full'}
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
                  'flex flex-col gap-2 max-h-44 pb-1 h-full overflow-auto'
                }
              >
                {tags &&
                  tags.length > 0 &&
                  tags?.map((tag) => (
                    <div key={tag.id} className={'flex items-center gap-1.5'}>
                      <Checkbox
                        checked={selectedTags.some(
                          (selectedTag) => selectedTag.id === tag.id
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
                                (selectedTag) => selectedTag.id !== tag.id
                              )
                            );
                          }
                        }}
                        id={tag.id}
                        label={tag.name}
                        onChange={(e) => {
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
                  setNewTagName('');
                }}
                variant={'outline'}
                className={''}
                type={'button'}
              >
                {newTag ? 'Cancelar' : 'Agregar nueva'}
              </Button>
              {newTag && (
                <>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className={'text-md'}>
                      <Label forHtml={'newTag'}>
                        Nombre de la nueva categoría
                      </Label>
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        id={'newTag'}
                        name={'newTag'}
                        placeholder={''}
                      />
                    </div>
                    <div className={'mt-2'}>
                      <Button
                        onClick={handleAddTag}
                        type={'button'}
                        variant={'secondary'}
                        className={'w-zfull'}
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
      </form>
    </>
  );
};
export default CreateForm;
