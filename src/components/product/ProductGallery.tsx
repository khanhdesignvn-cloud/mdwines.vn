"use client";

import { useState } from "react";
import Image from "next/image";
import { WineBottleArt } from "./WineBottleArt";

export function ProductGallery({
  images,
  category,
  name,
}: {
  images: string[];
  category: string;
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-3xl bg-gradient-to-b from-cream-200 to-cream-100 py-16">
        <WineBottleArt category={category} className="h-[26rem] w-auto drop-shadow-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[28rem] overflow-hidden rounded-3xl bg-cream-200">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                i === active ? "border-wine-700" : "border-transparent"
              }`}
            >
              <Image src={src} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
