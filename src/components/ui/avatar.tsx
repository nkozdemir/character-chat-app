"use client";

import * as React from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  gradient?: string;
  fallback?: string;
};

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

export function Avatar({
  src,
  alt,
  className,
  size = "md",
  gradient = "from-slate-700 to-slate-900",
  fallback,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/10",
        sizeMap[size],
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          gradient,
          "flex items-center justify-center text-white font-semibold",
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 64px, 96px"
          />
        ) : (
          <span>{fallback ?? getInitials(alt)}</span>
        )}
      </div>
    </div>
  );
}
