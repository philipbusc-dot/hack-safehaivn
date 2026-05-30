import { useEffect, useState } from "react";

interface AvatarProps {
  src?: string | null;
  /** Name used for the initial-letter fallback. */
  name: string;
  /** Sizing / shape / colors for the outer circle, e.g. "size-8 rounded-full bg-neutral-800". */
  className?: string;
}

/**
 * Circular avatar that shows the image when available, and falls back to the
 * name's initial letter when there's no URL OR the image fails to load.
 */
export default function Avatar({ src, name, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  // Reset the failure flag when the source changes (e.g. switching contacts).
  useEffect(() => setFailed(false), [src]);

  const initial = (name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <div
      className={`flex items-center justify-center overflow-hidden font-bold uppercase ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
