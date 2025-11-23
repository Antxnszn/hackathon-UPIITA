import React from "react";

interface ImageSelectorProps {
  images: string[];
  selectedImageIndex: number | null;
  onSelect: (index: number) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  selectedImageIndex,
  onSelect,
}) => {
  if (images.length === 0) {
    return <div className="text-gray-500 text-center">No hay imágenes disponibles.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((imgSrc, index) => (
        <div
          key={index}
          onClick={() => onSelect(index)}
          className={`
            relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-200 group
            ${
              selectedImageIndex === index
                ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105"
                : "border-gray-800 hover:border-gray-600"
            }
          `}
        >
          {/* Imagen */}
          <img
            src={imgSrc}
            alt={`Generación ${index + 1}`}
            className="w-full h-auto object-cover aspect-square"
          />

          {/* Badge de selección */}
          <div className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${selectedImageIndex === index ? "bg-blue-500 text-white" : "bg-black/50 text-gray-300"}
          `}>
            {index + 1}
          </div>
          
          {/* Overlay al hacer hover */}
          {selectedImageIndex !== index && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          )}
        </div>
      ))}
    </div>
  );
};