"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { FALLBACK_IMAGE, cn } from "@/lib/utils";

interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
  showSkeleton?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  fallback = FALLBACK_IMAGE,
  className,
  showSkeleton = true,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {showSkeleton && loading && (
        <div className="absolute inset-0 bg-secondary/20 animate-pulse z-10" />
      )}
      <Image
        {...props}
        src={error ? fallback : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          loading ? "opacity-0" : "opacity-100",
          // Allow passing in object-cover etc via className, but ensure it applies to the img
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
