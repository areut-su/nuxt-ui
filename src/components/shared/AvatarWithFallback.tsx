import { useState } from 'react';

interface AvatarWithFallbackProps {
  src?: string;
  name: string;
  sizeClass?: string;
  roundedClass?: string;
}

export function AvatarWithFallback({
  src,
  name,
  sizeClass = 'w-8 h-8',
  roundedClass = 'rounded-full',
}: AvatarWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`${sizeClass} ${roundedClass} inline-flex items-center justify-center font-medium text-xs shrink-0 select-none`}
        style={{
          backgroundColor: 'var(--d-accent-soft)',
          color: 'var(--d-primary)',
        }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${sizeClass} ${roundedClass} object-cover shrink-0`}
    />
  );
}
