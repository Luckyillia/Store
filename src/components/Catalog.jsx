import { getIconPath, getItemKey, getPrimaryCharacteristicsText } from '../utils/helpers';
import { MultiSelectDropdown, SingleSelectDropdown } from './Dropdown';
import { SORT_OPTIONS } from '../constants';

export function Catalog({
  items,
  onAddItem,
  typeOptions,
  visibleTypes,
  onVisibleTypesChange,
  eventOptions,
  eventFilter,
  setEventFilter,
  sortOption,
  setSortOption,
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
          <span className="font-mono text-[11px] text-mute">Показано: {items.length}</span>
        </div>

        <input
          ref={inputRef}
          value={catalogQuery}
          onChange={(e) => setCatalogQuery(e.target.value)}
          placeholder="Фильтр каталога: текст / ID / категория..."
          autoComplete="off"
          className="mb-3 w-full rounded-md border border-hair bg-raised px-3 py-2 font-body text-sm text-ink placeholder:text-mute outline-none transition-colors focus:border-signal/50"
        />

        <div className="flex flex-wrap gap-2">
          <MultiSelectDropdown
            label="Тип"
            options={typeOptions}
            selected={visibleTypes}
            onChange={onVisibleTypesChange}
          />
          <MultiSelectDropdown
            label="Ивент"
            options={eventOptions}
            selected={eventFilter}
            onChange={setEventFilter}
            zeroLabel="Ивент: все"
          />
          <SingleSelectDropdown
            label="Сортировка"
            options={SORT_OPTIONS}
            value={sortOption}
            onChange={setSortOption}
          />
        </div>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2.5">
          {items.map((item) => {
            const chars = getPrimaryCharacteristicsText(item);
            return (
              <button
                key={getItemKey(item)}
                type="button"
                onClick={() => onAddItem(item)}
                className="group flex flex-col items-center gap-1.5 rounded-md border border-hair bg-panel p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-signal/50"
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
                <span className="break-words font-body text-[11px] leading-tight text-ink transition-colors group-hover:text-signal">
                  {item.name}
                </span>
                {chars ? (
                  <span className="font-mono text-[9px] leading-none text-mute">{chars}</span>
                ) : null}
                {item.event ? (
                  <span className="rounded-full border border-amber/30 bg-amber/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-amber">
                    {item.event}
                  </span>
                ) : null}
              </button>
            );
          })}

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