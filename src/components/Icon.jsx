import React, { useState } from 'react';
import { getIconPath, makeFallbackText } from '../utils/helpers';

export function Icon({ item }) {
  const [failed, setFailed] = useState(false);
  const src = getIconPath(item);

  return (
    <div className="itemIcon">
      {!failed && src ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <div className="fallback">{makeFallbackText(item?.name)}</div>
      )}
    </div>
  );
}
