import { useState } from 'react';
import { Layers, X } from 'lucide-react';

export function SetBuilderBar({ count, onCreate, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  if (!count) return null;

  function handleCreate() {
    onCreate({ name: name.trim(), price: price.trim() });
    setName('');
    setPrice('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCreate();
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-signal/40 bg-signal/10 px-3 py-2.5">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-signal">
        <Layers size={13} /> Выбрано: {count}
      </span>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Название сета (необязательно)"
        className="min-w-[130px] flex-1 rounded-md border border-hair bg-raised px-2.5 py-1.5 font-body text-xs text-ink outline-none transition-colors focus:border-signal/50"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Цена за сет $"
        className="w-28 rounded-md border border-hair bg-raised px-2.5 py-1.5 font-body text-xs text-ink outline-none transition-colors focus:border-signal/50"
      />
      <button
        type="button"
        onClick={handleCreate}
        className="whitespace-nowrap rounded-md border border-signal bg-signal/20 px-3 py-1.5 font-body text-xs font-medium text-signal transition-colors hover:bg-signal/30"
      >
        Создать сет
      </button>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Отменить выбор"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-mute transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <X size={14} />
      </button>
    </div>
  );
}