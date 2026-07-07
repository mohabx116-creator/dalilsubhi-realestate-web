import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SafeRealEstateImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  iconClassName?: string;
}

export function SafeRealEstateImage({
  src,
  alt,
  className = 'relative overflow-hidden bg-gradient-to-br from-[#f5efe4] to-[#e8ddc7]',
  imgClassName = 'h-full w-full object-cover',
  iconClassName = 'h-10 w-10 text-[#8b7c61]',
}: SafeRealEstateImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={className}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={imgClassName}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#8b7c61]">
          <Building2 className={iconClassName} />
        </div>
      )}
    </div>
  );
}
