import React from 'react';

interface ImageSelectorProps {
  images: string[];
  selectedImageIndex: number | null;
  onSelect: (index: number) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ images, selectedImageIndex, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {images.map((src, index) => (
        <div
          key={index}
          onClick={() => onSelect(index)}
          className={`cursor-pointer group relative rounded-xl overflow-hidden border-4 transition-all duration-300 ${
            selectedImageIndex === index
              ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
              : 'border-transparent hover:border-gray-600 hover:scale-102'
          }`}
        >
          <div className="aspect-square bg-gray-800 relative">
            {/* In a real app, this would be an <img src={src} /> */}
            <img 
              src={src} 
              alt={`Retrato generado ${index + 1}`}
              className="w-full h-full object-cover filter grayscale contrast-125" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            
            {selectedImageIndex === index && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
          </div>
          <div className="bg-gray-900 p-4 text-center">
            <span className={`font-medium ${selectedImageIndex === index ? 'text-blue-400' : 'text-gray-400'}`}>
              Opción {index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
