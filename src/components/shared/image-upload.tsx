import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/extension/carousel";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-uploader";
import { DropzoneOptions } from "react-dropzone";
import { CiStar } from "react-icons/ci";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

const Modal = ({ image, onClose }: any) => {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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

export const ImageUpload = ({ files, setFiles }: any) => {
  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 10,
    maxSize: 1 * 1920 * 1080,
  } satisfies DropzoneOptions;

  const [prevFilesCount, setPrevFilesCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addBufferToFiles = (newFiles: File[]) => {
    const updatedFiles = newFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
          const buffer = reader.result;
          const fileWithBuffer = Object.assign(file, {
            buffer,
            default: index === 0 ? true : false,
          });
          resolve(fileWithBuffer);
        };

        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(updatedFiles)
      .then((filesWithBuffer) => {
        setFiles(filesWithBuffer);
        console.log(filesWithBuffer);
      })
      .catch((error) => console.error("Error reading file buffers:", error));
  };

  const handleSetDefaultImage = (index: number) => {
    const updatedFiles = [...files];

    updatedFiles.forEach((file, idx) => {
      if (idx === index) {
        if (file.default) {
          file.default = false;
        } else {
          file.default = true;
        }
      } else {
        file.default = false;
      }
    });

    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (files.length > prevFilesCount) {
      addBufferToFiles(files);
      setPrevFilesCount(files.length);
    }
  }, [files]);

  const hasFiles = files && files.length > 0;

  const handleImageClick = (file: File) => {
    setSelectedImage(file);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}

      <Carousel className="min-[1740px]:col-span-1 col-span-2">
        <CarouselNext
          className={`top-1/3 -translate-y-1/3 ${
            !hasFiles && "opacity-50 pointer-events-none"
          }`}
        />
        <CarouselPrevious
          className={`top-1/3 -translate-y-1/3 ${
            !hasFiles && "opacity-50 pointer-events-none"
          }`}
        />
        <CarouselMainContainer className="min-[1740px]:h-60 h-96 ">
          {hasFiles ? (
            files.map((file: any, index: any) => (
              <SliderMainItem
                key={index}
                className="bg-transparent cursor-pointer"
                onClick={() => handleImageClick(file)}
              >
                <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                  <img
                    src={URL?.createObjectURL(file)}
                    alt={`Slide ${index + 1}`}
                    className="h-full w-full object-contain rounded-xl"
                  />
                </div>
              </SliderMainItem>
            ))
          ) : (
            <SliderMainItem className="bg-transparent cursor-pointer">
              <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                Agrega imágenes para ser mostradas
              </div>
            </SliderMainItem>
          )}
        </CarouselMainContainer>
        <CarouselThumbsContainer>
          {hasFiles ? (
            files.map((file: any, index: any) => (
              <SliderThumbItem
                key={index}
                index={index}
                className="bg-transparent cursor-pointer"
                onClick={() => handleImageClick(file)}
              >
                <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                  <img
                    src={URL?.createObjectURL(file)}
                    alt={`Thumb ${index + 1}`}
                    className="h-full w-full object-cover rounded-xl"
                  />
                </div>
              </SliderThumbItem>
            ))
          ) : (
            <SliderThumbItem
              index={1}
              className="bg-transparent cursor-pointer"
            >
              <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background ">
                ejemplo
              </div>
            </SliderThumbItem>
          )}
        </CarouselThumbsContainer>
      </Carousel>

      <div className="col-span-2">
        <FileUploader
          value={files}
          onValueChange={setFiles}
          dropzoneOptions={dropzone}
          className="grid min-[800px]:grid-cols-3"
        >
          <div className="min-[800px]:col-span-2">
            <FileInput className="border border-dashed h-[330px] mt-1 w-full flex justify-center items-center border-gray-300">
              <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                <svg
                  className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-400"
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
                <p className="mb-1 text-sm text-gray-400 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                  &nbsp; or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400">
                  SVG, PNG, JPG or GIF
                </p>
              </div>
            </FileInput>
          </div>
          <FileUploaderContent className="min-[800px]:h-[330px] mt-1 overflow-y-auto">
            {files &&
              files.map((item: any, index: any) => (
                <FileUploaderItem className="group" key={index} index={index}>
                  <span className="truncate max-w-52">{item.name}</span>

                  <div
                    className="ml-auto mr-6 cursor-pointer"
                    onClick={() => {
                      handleSetDefaultImage(index);
                    }}
                  >
                    {item.default ? (
                      <IoIosStar className="text-yellow-500" />
                    ) : (
                      <IoIosStarOutline />
                    )}
                  </div>
                </FileUploaderItem>
              ))}
          </FileUploaderContent>
        </FileUploader>
      </div>
    </>
  );
};
