import React, { useState } from "react";
import Image from "next/image";

interface ImageCellProps {
  url: string;
}

const ImageCell: React.FC<ImageCellProps> = ({ url }) => {
  const [showImage, setShowImage] = useState(true);

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-[150px] h-[100px] flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
      {url && isValidUrl(url) && showImage ? (
        <Image
          src={url}
          alt="Location"
          width={150}
          height={100}
          style={{ objectFit: "cover" }}
          loading="lazy"
          onError={() => setShowImage(false)}
        />
      ) : (
        <span className="text-sm text-gray-500">No image</span>
      )}
    </div>
  );
};

export default ImageCell;
