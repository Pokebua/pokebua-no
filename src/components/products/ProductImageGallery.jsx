"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const focusClassName =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001016]";

const arrowClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-[#001016]/20 bg-white text-[#001016] shadow-sm transition-colors hover:bg-[#fff8e6] ${focusClassName}`;

export default function ProductImageGallery({
  images = [],
  preferredImage,
  featuredImage,
  productName,
}) {
  const imageId = useId();
  const thumbnailRefs = useRef([]);
  const touchStartRef = useRef(null);

  const imagesByUrl = new Map();

  for (const image of [...images, featuredImage, preferredImage]) {
    if (image?.url && !imagesByUrl.has(image.url)) {
      imagesByUrl.set(image.url, image);
    }
  }

  const galleryImages = [...imagesByUrl.values()];

  const [selectedUrl, setSelectedUrl] = useState(
    () => preferredImage?.url ?? featuredImage?.url ?? images[0]?.url ?? null,
  );

  const selectedIndex = Math.max(
    0,
    galleryImages.findIndex((image) => image.url === selectedUrl),
  );

  const selectedImage = galleryImages[selectedIndex];
  const imageCount = galleryImages.length;
  const hasMultipleImages = imageCount > 1;

  useEffect(() => {
    const button = thumbnailRefs.current[selectedIndex];
    const rail = button?.parentElement;

    if (!button || !rail) return;

    // Scroll only the thumbnail rail, without moving the page.
    const buttonRect = button.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();

    if (buttonRect.left < railRect.left) {
      rail.scrollLeft -= railRect.left - buttonRect.left;
    } else if (buttonRect.right > railRect.right) {
      rail.scrollLeft += buttonRect.right - railRect.right;
    }

    if (buttonRect.top < railRect.top) {
      rail.scrollTop -= railRect.top - buttonRect.top;
    } else if (buttonRect.bottom > railRect.bottom) {
      rail.scrollTop += buttonRect.bottom - railRect.bottom;
    }
  }, [selectedIndex]);

  function selectImage(index) {
    const image = galleryImages[index];

    if (image) {
      setSelectedUrl(image.url);
    }
  }

  function moveImage(direction) {
    if (!hasMultipleImages) return;

    const nextIndex = (selectedIndex + direction + imageCount) % imageCount;

    selectImage(nextIndex);
  }

  function handleKeyDown(event) {
    if (
      !hasMultipleImages ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveImage(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveImage(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectImage(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectImage(imageCount - 1);
    }
  }

  function handleTouchStart(event) {
    if (event.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }

    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (!start || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    moveImage(deltaX < 0 ? 1 : -1);
  }

  if (!selectedImage) {
    return (
      <div className="grid aspect-square min-w-0 place-items-center self-start rounded-2xl border-2 border-yellow-400 bg-white p-6 text-center text-gray-600">
        Bilde kommer snart
      </div>
    );
  }

  return (
    <section
      aria-label={`Produktbilder av ${productName}`}
      onKeyDown={handleKeyDown}
      className="grid min-w-0 self-start gap-3 lg:grid-cols-[4.5rem_minmax(0,1fr)]"
    >
      <div className="relative min-w-0 lg:col-start-2 lg:row-start-1">
        <div
          id={imageId}
          tabIndex={hasMultipleImages ? 0 : undefined}
          aria-label={
            hasMultipleImages
              ? "Produktbilde. Bruk venstre og høyre piltast for å bytte bilde."
              : undefined
          }
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            touchStartRef.current = null;
          }}
          className={`relative aspect-square touch-pan-y touch-pinch-zoom overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white ${focusClassName}`}
        >
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || productName}
            fill
            sizes="(min-width: 1152px) 450px, (min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
            draggable={false}
            className="select-none object-contain p-3 sm:p-4"
          />
        </div>

        {hasMultipleImages && (
          <>
            <p
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-[#001016] shadow-sm"
            >
              {selectedIndex + 1} / {imageCount}
            </p>

            <button
              type="button"
              aria-label="Forrige produktbilde"
              aria-controls={imageId}
              onClick={() => moveImage(-1)}
              className={`${arrowClassName} absolute left-3 top-1/2 -translate-y-1/2`}
            >
              <IoChevronBack aria-hidden="true" className="size-6" />
            </button>

            <button
              type="button"
              aria-label="Neste produktbilde"
              aria-controls={imageId}
              onClick={() => moveImage(1)}
              className={`${arrowClassName} absolute right-3 top-1/2 -translate-y-1/2`}
            >
              <IoChevronForward aria-hidden="true" className="size-6" />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="relative min-w-0 lg:col-start-1 lg:row-start-1">
          <div
            role="group"
            aria-label="Velg produktbilde"
            className="flex gap-2 overflow-x-auto p-1 lg:absolute lg:inset-0 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto"
          >
            {galleryImages.map((image, index) => (
              <button
                key={image.url}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                aria-label={`Vis bilde ${index + 1} av ${imageCount}`}
                aria-pressed={index === selectedIndex}
                aria-controls={imageId}
                onClick={() => selectImage(index)}
                className={`relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-white ${focusClassName} ${
                  index === selectedIndex
                    ? "border-[#001016] ring-2 ring-inset ring-[#f7b900]"
                    : "border-[#001016]/20 hover:border-[#f7b900]"
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <p role="status" aria-atomic="true" className="sr-only">
        Bilde {selectedIndex + 1} av {imageCount}
      </p>
    </section>
  );
}
