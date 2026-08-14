import { Tag } from 'lucide-react';

export function Header({ totalAdded, seller }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-hair bg-panel/80 px-5 backdrop-blur">
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-signal/40 bg-signal/15 text-signal">
        <Tag size={18} strokeWidth={2} />
      </span>

      <span className="font-display text-xl tracking-wide text-ink">Sokirovskiy Accessory</span>

      <span className="hidden border-l border-hair pl-3 font-body text-xs text-mute sm:block">
        Доска продаж · MTA Province
      </span>

      <div className="ml-auto flex items-center gap-2.5">
        {seller ? (
          <span className="hidden font-mono text-xs text-mute md:inline">✉ {seller}</span>
        ) : null}
        <span className="rounded-full border border-hair bg-raised px-2.5 py-1 font-mono text-[11px] text-mute">
          Добавлено:{' '}
          <span className="font-semibold text-signal">{totalAdded}</span>
        </span>
      </div>
    </header>
  );
}
