import { useEffect, useRef, useState } from 'react';

/**
 * Оборачивает "жёстко" свёрстанную карточку (фиксированной ширины baseWidth)
 * и масштабирует её под доступную ширину родителя через CSS transform.
 * Благодаря transform масштабируется вообще всё внутри — включая картинки.
 */
export function ScaledCard({ children, baseWidth = 860, minScale = 0.5, maxScale = 1.8 }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  // следим за шириной доступного места
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (!width) return;
      const next = Math.min(maxScale, Math.max(minScale, width / baseWidth));
      setScale(next);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth, minScale, maxScale]);

  // следим за реальной (немасштабированной) высотой контента,
  // чтобы обёртка резервировала правильную высоту в потоке
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect?.height;
      if (height) setContentHeight(height);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="w-full"
      style={{ height: contentHeight ? contentHeight * scale : undefined }}
    >
      <div
        ref={innerRef}
        style={{
          width: baseWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}