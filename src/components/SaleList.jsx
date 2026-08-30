import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { Icon } from './Icon';
import { LicensePlate } from './LicensePlate';
import { getPrimaryCharacteristicsText } from '../utils/helpers';

export function SaleList({
  items, onRemoveItem, onClearAll, onSetQty, onSetPrice,
  seller, setSeller, catalogOpen, setCatalogOpen,
  plateItems, onRemovePlate, onSetPlatePrice, onClearPlates,
}) {
  const hasPlates = plateItems && plateItems.length > 0;
  const hasItems = items && items.length > 0;
  const total = items.length + (plateItems?.length || 0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-hair px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCatalogOpen((v) => !v)}
            title={catalogOpen ? 'Скрыть каталог' : 'Показать каталог'}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-hair text-mute transition-colors hover:border-signal/50 hover:text-signal"
          >
            {catalogOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Добавлено{total > 0 ? ` (${total})` : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-md px-2 py-1 font-body text-[11px] text-danger transition-colors hover:bg-danger/10"
        >
          Очистить
        </button>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto p-3">
        {!hasItems && !hasPlates ? (
          <div className="py-10 text-center font-body text-xs leading-relaxed text-mute">
            Нажимай на предметы в каталоге
            <br />
            или добавляй номера сверху
          </div>
        ) : (
          <>
            {items.map((s, idx) => (
              <div
                key={s.key}
                className="mb-2 flex items-center gap-2.5 rounded-md border border-hair bg-panel p-2.5 transition-colors hover:border-signal/30"
              >
                <Icon item={s.item} />

                <div className="min-w-0 flex-1">
                  <p className="break-words font-body text-[11px] font-medium text-ink">{s.item.name}</p>
                  {getPrimaryCharacteristicsText(s.item) ? (
                    <p className="break-words font-mono text-[9px] text-mute">
                      {getPrimaryCharacteristicsText(s.item)}
                    </p>
                  ) : null}
                </div>

                <input
                  type="text"
                  value={s.price}
                  placeholder="Цена $"
                  onChange={(e) => onSetPrice(idx, e.target.value)}
                  className="w-20 rounded-md border border-hair bg-raised px-2 py-1 text-right font-mono text-[11px] text-ink outline-none transition-colors focus:border-signal/50"
                />

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onSetQty(idx, s.qty - 1)}
                    className="flex h-5 w-5 items-center justify-center rounded border border-hair text-ink transition-colors hover:border-signal hover:bg-signal/15"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-5 text-center font-mono text-xs font-semibold text-ink">
                    {s.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSetQty(idx, s.qty + 1)}
                    className="flex h-5 w-5 items-center justify-center rounded border border-hair text-ink transition-colors hover:border-signal hover:bg-signal/15"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(idx)}
                  aria-label="Удалить"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-mute transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {hasPlates && (
              <>
                <div className="mb-2 mt-3 flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
                    Номера
                  </span>
                  <button
                    type="button"
                    onClick={onClearPlates}
                    className="font-body text-[10px] text-danger hover:underline"
                  >
                    Очистить
                  </button>
                </div>

                {plateItems.map((p) => (
                  <div
                    key={p.key}
                    className="mb-2 flex items-center gap-2.5 rounded-md border border-hair bg-panel p-2.5 transition-colors hover:border-signal/30"
                  >
                    <div className="w-[100px] shrink-0 overflow-hidden">
                      <LicensePlate number={p.number} region={p.region} size="tiny" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[11px] font-medium tracking-wider text-ink">
                        {p.number}
                      </p>
                      <p className="font-body text-[10px] text-mute">Регион {p.region}</p>
                    </div>

                    <input
                      type="text"
                      value={p.price}
                      placeholder="Цена $"
                      onChange={(e) => onSetPlatePrice(p.key, e.target.value)}
                      className="w-20 rounded-md border border-hair bg-raised px-2 py-1 text-right font-mono text-[11px] text-ink outline-none transition-colors focus:border-signal/50"
                    />

                    <button
                      type="button"
                      onClick={() => onRemovePlate(p.key)}
                      aria-label="Удалить"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-mute transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-hair p-3">
        <input
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
          placeholder="Ваш ник / контакт для покупателя"
          className="w-full rounded-md border border-hair bg-raised px-3 py-2 text-center font-body text-xs text-ink outline-none transition-colors focus:border-signal/50"
        />
      </div>
    </div>
  );
}
