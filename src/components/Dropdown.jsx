import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function MultiSelectDropdown({ label, options, selected, onChange, zeroLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const count = selected.size;
  const summary = count === 0 && zeroLabel ? zeroLabel : `${label} (${count})`;

  function toggle(key) {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(next);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors ${
          count > 0
            ? 'border-signal bg-signal/15 text-signal'
            : 'border-hair text-mute hover:border-signal/40 hover:text-ink'
        }`}
      >
        {summary}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-72 w-56 overflow-y-auto scroll-thin rounded-md border border-hair bg-panel p-2 shadow-card">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="font-mono text-[9px] uppercase tracking-wide text-mute">{label}</span>
            {count > 0 && (
              <button
                type="button"
                onClick={() => onChange(new Set())}
                className="font-body text-[10px] text-danger hover:underline"
              >
                Сбросить
              </button>
            )}
          </div>
          {options.map((opt) => (
            <label
              key={opt.key}
              className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 font-body text-xs text-ink transition-colors hover:bg-raised"
            >
              <input
                type="checkbox"
                checked={selected.has(opt.key)}
                onChange={() => toggle(opt.key)}
                className="accent-signal"
              />
              {opt.label}
            </label>
          ))}
          {options.length === 0 && (
            <div className="px-1.5 py-2 font-body text-[11px] text-mute">Нет опций</div>
          )}
        </div>
      )}
    </div>
  );
}

export function SingleSelectDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const current = options.find((o) => o.key === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors ${
          value !== 'default'
            ? 'border-signal bg-signal/15 text-signal'
            : 'border-hair text-mute hover:border-signal/40 hover:text-ink'
        }`}
      >
        {label}: {current?.label || ''}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-52 overflow-hidden rounded-md border border-hair bg-panel p-1 shadow-card">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className={`block w-full rounded px-2 py-1.5 text-left font-body text-xs transition-colors ${
                opt.key === value ? 'bg-signal/15 text-signal' : 'text-ink hover:bg-raised'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}