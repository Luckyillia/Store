import { getIconPath, formatDateRu, getPrimaryCharacteristicsText } from '../utils/helpers';

export function BoardCard({ cardItems, cardNumber, totalCards, seller, isSkins = false }) {
  const GRID_COLS = isSkins ? 'grid-cols-6' : 'grid-cols-6';

  return (
    <div className="relative w-[1160px] min-w-[1160px] rounded-2xl border border-hair bg-panel p-5 shadow-card">
      {totalCards > 1 && (
        <div className="absolute right-14 top-4 rounded-full border border-hair bg-raised px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-mute">
          {cardNumber} / {totalCards}
        </div>
      )}

      <div className="mb-3 flex items-center justify-center gap-3">
        <div className="font-display text-lg tracking-wide text-ink">
          {isSkins ? '🏪 ПРОДАЮ СКИНЫ' : '🏪 ПРОДАЮ'}
        </div>
        {seller ? (
          <div className="rounded-full bg-raised px-2.5 py-1 font-mono text-[11px] text-mute">
            ✉ {seller}
          </div>
        ) : null}
      </div>

      <div className="mb-4 text-center font-mono text-[11px] tracking-wide text-mute">
        {isSkins
          ? `${cardItems.length} скин${cardItems.length === 1 ? '' : cardItems.length <= 4 ? 'а' : 'ов'}`
          : `${cardItems.length} позиц${cardItems.length === 1 ? 'ия' : cardItems.length <= 4 ? 'ии' : 'ий'}`}
        {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''} · MTA Province
      </div>

      <div className="mb-4 h-px bg-hair" />

      <div className={`grid ${GRID_COLS} gap-2`}>
        {cardItems.map((s) => {
          const price = String(s.price || '').trim();
          return (
            <div
              key={s.key}
              className={`flex flex-col gap-2 rounded-xl border border-hair bg-raised p-2.5 ${
                isSkins ? '' : 'min-h-[138px]'
              }`}
            >
              {isSkins ? (
                <div className="aspect-[400/950] w-full overflow-hidden rounded-lg bg-raised2">
                  <img
                    src={getIconPath(s.item) || ''}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-lg bg-raised2">
                    <img
                      src={getIconPath(s.item) || ''}
                      alt=""
                      className="h-[50px] w-[50px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-mute">
                    {s.qty > 1 ? `x${s.qty}` : ''}
                  </div>
                </div>
              )}

              <div className={`flex flex-col gap-1 ${isSkins ? 'mt-1' : ''}`}>
                <div className="break-words font-body text-[11px] font-bold leading-tight text-ink">
                  {s.item.name}
                </div>
                {!isSkins && getPrimaryCharacteristicsText(s.item) ? (
                  <div className="break-words font-mono text-[9px] leading-snug text-mute">
                    {getPrimaryCharacteristicsText(s.item)}
                  </div>
                ) : null}
                {price ? (
                  <div className="font-display text-sm font-bold text-amber">{price}</div>
                ) : (
                  <div className="font-body text-xs font-medium text-ink/25">договор</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="font-display text-[9px] font-bold tracking-[0.1em] text-ink/15">
          Sokirovskiy Accessory · MTA PROVINCE
        </div>
        <div className="font-body text-[11px] text-ink/25">{formatDateRu(new Date())}</div>
      </div>
    </div>
  );
}