import { SlidersHorizontal } from 'lucide-react';
import { getIconPath, getItemKey } from '../utils/helpers';

export function Catalog({
  items,
  onAddItem,
  filtersOpen,
  setFiltersOpen,
  hiddenTypes,
  setHiddenTypes,
  filterConfig,
  catalogQuery,
  setCatalogQuery,
  inputRef,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-hair p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Каталог
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-mute">
              Показано: {items.length}
            </span>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              title="Фильтры"
              aria-label="Переключить фильтры"
              className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                filtersOpen
                  ? 'border-signal bg-signal/15 text-signal'
                  : 'border-hair text-mute hover:border-signal/50 hover:text-signal'
              }`}
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          value={catalogQuery}
          onChange={(e) => setCatalogQuery(e.target.value)}
          placeholder="Фильтр каталога: текст / ID / категория..."
          autoComplete="off"
          className="w-full rounded-md border border-hair bg-raised px-3 py-2 font-body text-sm text-ink placeholder:text-mute outline-none transition-colors focus:border-signal/50"
        />

        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ${
            filtersOpen ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="scroll-thin flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              {filterConfig.map((f) => {
                const active = !hiddenTypes[f.key];
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() =>
                      setHiddenTypes((p) => ({ ...p, [f.key]: !p[f.key] }))
                    }
                    title={active ? 'Скрыть ' + f.label : 'Показать ' + f.label}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
                      active
                        ? 'border-signal bg-signal/15 text-signal'
                        : 'border-hair text-mute hover:border-signal/40 hover:text-ink'
                    }`}
                  >
                    {active ? '✓ ' : ''}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2.5">
          {items.map((item) => (
            <button
              key={getItemKey(item)}
              type="button"
              onClick={() => onAddItem(item)}
              className="group flex flex-col items-center gap-2 rounded-md border border-hair bg-panel p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-signal/50"
            >
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-hair bg-raised2">
                <img
                  src={getIconPath(item) || ''}
                  alt=""
                  className="h-14 w-14 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </span>
              <span className="line-clamp-2 h-8 font-body text-[11px] leading-tight text-ink transition-colors group-hover:text-signal">
                {item.name}
              </span>
            </button>
          ))}

          {items.length === 0 && (
            <div className="col-span-3 py-10 text-center font-body text-xs text-mute">
              Ничего не найдено по текущему фильтру.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
