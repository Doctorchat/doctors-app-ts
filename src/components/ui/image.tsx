import { cn } from "@/utils";
import React from "react";

interface ImageProps {
  width?: number | string;
  height?: string | number;
  alt: string;
  src: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ width, height, alt, src, className }) => {
  return (
    <img
      className={cn("dc-image", className)}
      loading="lazy"
      width={width}
      height={height}
      alt={alt}
      src={src}
    />
  );
}

export default Image;