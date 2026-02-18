import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({ fallbackSrc, ...props }: ImageWithFallbackProps) {
  // We don't need didError anymore with the new logic using standard img onError

  // unless we want to show the SVG error placeholder if BOTH fail.
  // The original code showed an SVG on error.
  // Let's modify logic: 
  // 1. Try src. 
  // 2. On error -> if fallbackSrc exists, switch src to fallbackSrc. 
  // 3. If that also fails (or no fallbackSrc), show the SVG placeholder.

  // Actually, the original code completely replaced the <img> with a <div> containing an SVG when error occurred.
  // We want to support `fallbackSrc` to show a placeholder image instead of the SVG if provided.

  const { src, alt, style, className, ...rest } = props

  const [imgSrc, setImgSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);

  // Update internal state if prop changes
  React.useEffect(() => {
    setImgSrc(src);
    setHasFailed(false);
  }, [src]);

  const handleLoadError = () => {
    if (!hasFailed && fallbackSrc) {
      setHasFailed(true);
      setImgSrc(fallbackSrc);
    } else {
      // If already failed (meaning fallback failed) OR no fallback provided
      setHasFailed(true);
      setImgSrc(ERROR_IMG_SRC);
    }
  }

  // Logic: 
  // If we are showing ERROR_IMG_SRC, we might want to render the DIV structure.
  // If we are showing fallbackSrc, just render IMG.

  if (hasFailed && imgSrc === ERROR_IMG_SRC) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    <img
      src={imgSrc || ERROR_IMG_SRC}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleLoadError}
    />
  )
}
