import React from 'react';
import { LicensePlate } from './LicensePlate';
import { formatDateRu } from '../utils/helpers';

const PLATES_PER_CARD = 12;

export function PlatesBoardCard({ plateItems, cardNumber, totalCards, seller }) {
  return (
    <div className="boardCard boardCard--plates">
      {totalCards > 1 && (
        <div className="boardCardBadge">
          {cardNumber} / {totalCards}
        </div>
      )}

      <div className="boardTitleRow">
        <div className="boardTitle">🔢 ПРОДАЮ НОМЕРА</div>
        {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
      </div>

      <div className="boardSubtitle">
        {plateItems.length} номер{plateItems.length === 1 ? '' : plateItems.length <= 4 ? 'а' : 'ов'}
        {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''}
        {' '}· MTA Province
      </div>

      <div className="boardDivider" />

      <div className="platesGrid">
        {plateItems.map((p) => (
          <div className="platesGridItem" key={p.key}>
            <div className="platesGridPlate">
              <LicensePlate number={p.number} region={p.region} size="medium" />
            </div>
            {p.price ? (
              <div className="platesGridPrice">{p.price}</div>
            ) : (
              <div className="platesGridPrice platesGridPrice--none">—</div>
            )}
          </div>
        ))}
      </div>

      <div className="boardFooter">
        <div className="boardWatermark">PROVHUB · MTA PROVINCE</div>
        <div className="boardStats">{formatDateRu(new Date())}</div>
      </div>
    </div>
  );
}

export { PLATES_PER_CARD };
