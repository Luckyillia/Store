import React from 'react';
import { formatDateRu, getItemCategory, parsePrice, formatNumber } from '../utils/helpers';
import { FILTER_CONFIG } from '../constants';

export function SummaryCard({ saleItems, plateItems = [], seller }) {
  return (
    <div className="boardCard boardCard--summary">
      <div className="boardTitleRow">
        <div className="boardTitle">📊 ИТОГО</div>
        {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
      </div>
      <div className="boardSubtitle">
        {saleItems.length + plateItems.length} позиций всего · MTA Province
      </div>
      <div className="boardDivider" />
      <div className="summaryGrid">
        {(() => {
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
            if (!cats['plates']) cats['plates'] = { count: 0, qty: 0, sum: 0 };
            cats['plates'].count += 1;
            cats['plates'].qty += 1;
            const price = parsePrice(p.price);
            cats['plates'].sum += price;
            totalSum += price;
          });

          const rows = Object.entries(cats)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([cat, data]) => {
              const label = cat === 'plates'
                ? 'Номера'
                : (FILTER_CONFIG.find((f) => f.key === cat)?.label || cat);
              return (
                <div className="summaryRow" key={cat}>
                  <span className="summaryLabel">{label}</span>
                  <span className="summaryValue">
                    {data.qty} шт.{data.sum > 0 ? ' · $' + formatNumber(data.sum) : ''}
                  </span>
                </div>
              );
            });

          rows.push(
            <div className="summaryRow summaryRow--total" key="total">
              <span className="summaryLabel">ОБЩАЯ СУММА</span>
              <span className="summaryValue summaryValue--total">${formatNumber(totalSum)}</span>
            </div>
          );

          return rows;
        })()}
      </div>
      <div className="boardFooter">
        <div className="boardWatermark">PROVHUB · MTA PROVINCE</div>
        <div className="boardStats">{formatDateRu(new Date())}</div>
      </div>
    </div>
  );
}
