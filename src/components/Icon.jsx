import { useState } from 'react';
import { getIconPath, makeFallbackText } from '../utils/helpers';

export function Icon({ item }) {
  const [failed, setFailed] = useState(false);
  const src = getIconPath(item);

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-hair bg-raised2">
      {!failed && src ? (
        <img
          src={src}
          alt=""
          className="h-9 w-9 object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-1 text-center font-mono text-[10px] font-semibold leading-tight text-mute">
          {makeFallbackText(item?.name)}
        </span>
      )}
    </div>
  );
}
