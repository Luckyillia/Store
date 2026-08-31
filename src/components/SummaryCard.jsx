import { formatDateRu, getItemCategory, parsePrice, formatNumber } from '../utils/helpers';
import { FILTER_CONFIG } from '../constants';

export function SummaryCard({ saleItems, plateItems = [], seller }) {
  const cats = {};
  let totalSum = 0;

  saleItems.forEach((s) => {
    const cat = getItemCategory(s.item);
    if (!cats[cat]) cats[cat] = { count: 0, qty: 0, sum: 0 };
    cats[cat].count += 1;
    cats[cat].qty += s.qty;
    const p = parsePrice(s.price);
    cats[cat].sum += p * s.qty;
    totalSum += p * s.qty;
  });

  plateItems.forEach((p) => {
    if (!cats.plates) cats.plates = { count: 0, qty: 0, sum: 0 };
    cats.plates.count += 1;
    cats.plates.qty += 1;
    const price = parsePrice(p.price);
    cats.plates.sum += price;
    totalSum += price;
  });

  const rows = Object.entries(cats).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="relative w-[1160px] min-w-[1160px] rounded-2xl border border-signal/30 bg-panel p-6 shadow-card">
      <div className="mb-3 flex items-center justify-center gap-3">
        <div className="font-display text-lg tracking-wide text-ink">📊 ИТОГО</div>
        {seller ? (
          <div className="rounded-full bg-raised px-2.5 py-1 font-mono text-[11px] text-mute">
            ✉ {seller}
          </div>
        ) : null}
      </div>

      <div className="mb-4 text-center font-mono text-[11px] tracking-wide text-mute">
        {saleItems.length + plateItems.length} позиций всего · MTA Province
      </div>

      <div className="mb-4 h-px bg-hair" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {rows.map(([cat, data]) => {
          const label =
            cat === 'plates' ? 'Номера' : FILTER_CONFIG.find((f) => f.key === cat)?.label || cat;
          return (
            <div key={cat} className="flex items-center justify-between border-b border-white/5 py-1.5">
              <span className="font-body text-[11px] text-mute">{label}</span>
              <span className="font-display text-xs font-bold text-ink">
                {data.qty} шт.
                {data.sum > 0 ? <span className="text-amber"> · ${formatNumber(data.sum)}</span> : ''}
              </span>
            </div>
          );
        })}

        <div className="col-span-2 mt-1.5 flex items-center justify-between border-t border-signal/30 pt-2.5">
          <span className="font-display text-xs font-bold text-signal">ОБЩАЯ СУММА</span>
          <span className="font-display text-base font-bold text-signal">
            ${formatNumber(totalSum)}
          </span>
        </div>
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
