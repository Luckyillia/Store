import { getIconPath, formatDateRu } from '../utils/helpers';

export function SetBoardCard({ set, cardNumber, totalCards, seller }) {
  const { name, price, qty, mode, components } = set;
  const isGrouped = mode === 'grouped';

  return (
    <div
      className={`relative w-fit max-w-[1160px] rounded-2xl border p-5 shadow-card ${
        isGrouped
          ? 'border-signal/40 bg-panel'
          : 'border-hair bg-gradient-to-br from-signal/10 to-signal/[0.02]'
      }`}
    >
      {totalCards > 1 && (
        <div className="absolute right-4 top-4 rounded-full border border-hair bg-raised px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-mute">
          {cardNumber} / {totalCards}
        </div>
      )}

      <div className="mb-3 flex flex-col items-center gap-1.5 text-center">
        <div className="font-display text-lg tracking-wide text-ink">
          🎁 СЕТ «{name}»{qty > 1 ? ` ×${qty}` : ''}
        </div>
        {seller ? (
          <div className="rounded-full bg-raised px-2.5 py-1 font-mono text-[11px] text-mute">
            ✉ {seller}
          </div>
        ) : null}
      </div>

      <div className="mb-4 text-center font-mono text-[11px] leading-snug tracking-wide text-mute">
        {components.length} предмет{components.length === 1 ? '' : components.length <= 4 ? 'а' : 'ов'} в сете
        {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''} · MTA Province
      </div>

      <div className="mb-4 h-px bg-hair" />

      <div className="flex flex-wrap justify-center gap-3">
        {components.map((c) => (
          <div
            key={c.key}
            className={`flex w-[104px] shrink-0 flex-col items-center gap-1.5 rounded-xl border p-2.5 ${
              isGrouped ? 'border-hair bg-raised' : 'border-signal/20 bg-raised/60'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-raised2">
              <img
                src={getIconPath(c.item) || ''}
                alt=""
                className="h-14 w-14 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="text-center font-body text-[10px] font-semibold leading-tight text-ink">
              {c.item.name}
            </div>
            {c.qty > 1 ? <div className="font-mono text-[9px] text-mute">×{c.qty}</div> : null}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center border-t border-white/5 pt-3.5">
        {price ? (
          <div className="text-center font-display text-2xl font-bold leading-tight text-amber">
            {price}
            <div className="text-xs font-normal text-mute">за весь сет</div>
          </div>
        ) : (
          <div className="font-body text-sm font-medium text-ink/25">договорная цена</div>
        )}
      </div>

      <div className="mt-3.5 flex flex-col items-center gap-0.5 border-t border-white/5 pt-3 text-center">
        <div className="font-display text-[9px] font-bold tracking-[0.1em] text-ink/15">
          Sokirovskiy Accessory · MTA PROVINCE
        </div>
        <div className="font-body text-[11px] text-ink/25">{formatDateRu(new Date())}</div>
      </div>
    </div>
  );
}