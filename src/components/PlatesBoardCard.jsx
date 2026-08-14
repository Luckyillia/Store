import { LicensePlate } from './LicensePlate';
import { formatDateRu } from '../utils/helpers';

const PLATES_PER_CARD = 12;

export function PlatesBoardCard({ plateItems, cardNumber, totalCards, seller }) {
  return (
    <div className="relative w-[860px] min-w-[860px] rounded-2xl border border-hair bg-panel p-6 shadow-card">
      {totalCards > 1 && (
        <div className="absolute right-14 top-4 rounded-full border border-hair bg-raised px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-mute">
          {cardNumber} / {totalCards}
        </div>
      )}

      <div className="mb-3 flex items-center justify-center gap-3">
        <div className="font-display text-lg tracking-wide text-ink">🔢 ПРОДАЮ НОМЕРА</div>
        {seller ? (
          <div className="rounded-full bg-raised px-2.5 py-1 font-mono text-[11px] text-mute">
            ✉ {seller}
          </div>
        ) : null}
      </div>

      <div className="mb-4 text-center font-mono text-[11px] tracking-wide text-mute">
        {plateItems.length} номер{plateItems.length === 1 ? '' : plateItems.length <= 4 ? 'а' : 'ов'}
        {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''} · MTA Province
      </div>

      <div className="mb-4 h-px bg-hair" />

      <div className="grid grid-cols-3 gap-x-5 gap-y-4">
        {plateItems.map((p) => (
          <div key={p.key} className="flex flex-col items-start gap-1.5">
            <div className="h-[63px] w-[279px] shrink-0 overflow-hidden">
              <LicensePlate number={p.number} region={p.region} size="medium" />
            </div>
            {p.price ? (
              <div className="pl-1 font-display text-sm font-bold text-amber">{p.price}</div>
            ) : (
              <div className="pl-1 font-body text-xs font-medium text-ink/25">—</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="font-display text-[9px] font-bold tracking-[0.1em] text-ink/15">
          PROVHUB · MTA PROVINCE
        </div>
        <div className="font-body text-[11px] text-ink/25">{formatDateRu(new Date())}</div>
      </div>
    </div>
  );
}

export { PLATES_PER_CARD };
