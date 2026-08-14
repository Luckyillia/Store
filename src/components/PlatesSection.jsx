import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { LicensePlate } from './LicensePlate';

export function PlatesSection({ onAddPlate }) {
  const [number, setNumber] = useState('');
  const [region, setRegion] = useState('77');
  const [price, setPrice] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const inputRef = useRef(null);

  function handleAdd() {
    const trimmed = number.trim();
    if (!trimmed) return;
    onAddPlate({ number: trimmed, region: region.trim() || '77', price });
    setNumber('');
    setPrice('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  const hasNumber = number.trim().length > 0;

  return (
    <div className="shrink-0 border-b border-hair bg-signal/[0.04]">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal"
      >
        <span>🚗</span>
        Добавить номер
        {collapsed ? (
          <ChevronDown size={14} className="ml-auto text-mute" />
        ) : (
          <ChevronUp size={14} className="ml-auto text-mute" />
        )}
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ${
          collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2.5 px-4 pb-4">
            <div className="flex min-h-[54px] items-center justify-center">
              {hasNumber ? (
                <LicensePlate number={number} region={region} size="medium" />
              ) : (
                <span className="font-body text-xs text-mute">
                  Введи номер — увидишь превью
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={number}
                onChange={(e) => setNumber(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder="А123БВ"
                maxLength={9}
                spellCheck={false}
                className="min-w-0 flex-1 rounded-md border border-hair bg-raised px-3 py-2 font-mono text-sm uppercase tracking-wider text-ink outline-none transition-colors focus:border-signal/50"
              />
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value.replace(/\D/g, '').slice(0, 3))}
                onKeyDown={handleKeyDown}
                placeholder="77"
                maxLength={3}
                className="w-16 rounded-md border border-hair bg-raised px-2 py-2 text-center font-mono text-sm text-ink outline-none transition-colors focus:border-signal/50"
              />
            </div>

            <div className="flex gap-2">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Цена $"
                className="min-w-0 flex-1 rounded-md border border-hair bg-raised px-3 py-2 font-body text-sm text-ink outline-none transition-colors focus:border-signal/50"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!hasNumber || !price.trim()}
                className="flex items-center gap-1 whitespace-nowrap rounded-md border border-signal/50 bg-signal/15 px-3 py-2 font-body text-xs font-medium text-signal transition-colors hover:bg-signal/25 disabled:cursor-not-allowed disabled:border-hair disabled:bg-transparent disabled:text-mute/50"
              >
                <Plus size={13} /> Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
