import { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, LayoutGrid, Minus, Plus, Rows3, X } from 'lucide-react';
import { getIconPath } from '../utils/helpers';

export function SetsSection({ sets, onRemoveSet, onUpdateSet, onRemoveSetComponent, onClearSets }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!sets || sets.length === 0) return null;

  return (
    <div className="mb-2">
      <div className="mb-2 mt-3 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-mute"
        >
          <Layers size={12} className="text-signal" />
          Сеты ({sets.length})
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        <button
          type="button"
          onClick={onClearSets}
          className="font-body text-[10px] text-danger hover:underline"
        >
          Очистить
        </button>
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-2.5">
          {sets.map((s) => (
            <div key={s.key} className="rounded-md border border-signal/30 bg-signal/[0.04] p-2.5">
              <div className="mb-2 flex items-center gap-2">
                <input
                  value={s.name}
                  onChange={(e) => onUpdateSet(s.key, { name: e.target.value })}
                  placeholder="Название сета"
                  className="min-w-0 flex-1 rounded-md border border-hair bg-raised px-2 py-1.5 font-body text-xs font-medium text-ink outline-none transition-colors focus:border-signal/50"
                />
                <button
                  type="button"
                  onClick={() => onUpdateSet(s.key, { mode: s.mode === 'collage' ? 'grouped' : 'collage' })}
                  title={s.mode === 'collage' ? 'Показывать сгруппированно' : 'Показывать коллажем'}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hair text-mute transition-colors hover:border-signal/50 hover:text-signal"
                >
                  {s.mode === 'collage' ? <LayoutGrid size={13} /> : <Rows3 size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveSet(s.key)}
                  aria-label="Удалить сет"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-mute transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mb-2 flex flex-wrap gap-1.5">
                {s.components.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-center gap-1.5 rounded-md border border-hair bg-raised px-1.5 py-1"
                  >
                    <div className="h-6 w-6 shrink-0 overflow-hidden rounded bg-raised2">
                      <img
                        src={getIconPath(c.item) || ''}
                        alt=""
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="max-w-[90px] truncate font-body text-[10px] text-ink">
                      {c.item.name}
                    </span>
                    {c.qty > 1 && <span className="font-mono text-[9px] text-mute">×{c.qty}</span>}
                    <button
                      type="button"
                      onClick={() => onRemoveSetComponent(s.key, c.key)}
                      aria-label="Убрать из сета"
                      className="text-mute transition-colors hover:text-danger"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={s.price}
                  placeholder="Цена за сет $"
                  onChange={(e) => onUpdateSet(s.key, { price: e.target.value })}
                  className="min-w-0 flex-1 rounded-md border border-hair bg-raised px-2 py-1 text-right font-mono text-[11px] text-ink outline-none transition-colors focus:border-signal/50"
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSet(s.key, { qty: Math.max(1, s.qty - 1) })}
                    className="flex h-5 w-5 items-center justify-center rounded border border-hair text-ink transition-colors hover:border-signal hover:bg-signal/15"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-5 text-center font-mono text-xs font-semibold text-ink">
                    {s.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateSet(s.key, { qty: s.qty + 1 })}
                    className="flex h-5 w-5 items-center justify-center rounded border border-hair text-ink transition-colors hover:border-signal hover:bg-signal/15"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}