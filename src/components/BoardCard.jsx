import React from 'react';
import { getIconPath, formatDateRu } from '../utils/helpers';

export function BoardCard({ cardItems, cardNumber, totalCards, seller, isSkins = false }) {
  return (
    <div className={`boardCard ${isSkins ? 'boardCard--skins' : ''}`}>
      {totalCards > 1 && (
        <div className="boardCardBadge">
          {cardNumber} / {totalCards}
        </div>
      )}
      <div className="boardTitleRow">
        <div className="boardTitle">{isSkins ? '🏪 ПРОДАЮ СКИНЫ' : '🏪 ПРОДАЮ'}</div>
        {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
      </div>

      <div className="boardSubtitle">
        {isSkins ? (
          `${cardItems.length} скин${cardItems.length === 1 ? '' : cardItems.length <= 4 ? 'а' : 'ов'}`
        ) : (
          `${cardItems.length} позиц${cardItems.length === 1 ? 'ия' : cardItems.length <= 4 ? 'ии' : 'ий'}`
        )}
        {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''}
        {' '}· MTA Province
      </div>
      <div className="boardDivider" />

      <div className={`boardItems ${isSkins ? 'boardItems--skins' : ''}`}>
        {cardItems.map((s) => {
          const price = String(s.price || '').trim();
          return (
            <div className={`boardItemCard ${isSkins ? 'boardItemCard--skin' : ''}`} key={s.key}>
              <div className={`boardItemTop ${isSkins ? 'boardItemTop--skin' : ''}`}>
                <div className={`boardItemIcon ${isSkins ? 'boardItemIcon--skin' : ''}`}>
                  <img
                    src={getIconPath(s.item) || ''}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
                  {s.qty > 1 ? `x${s.qty}` : ''}
                </div>
              </div>
              <div className={`boardItemBottom ${isSkins ? 'boardItemBottom--skin' : ''}`}>
                <div className="boardItemName2">{s.item.name}</div>
                {price ? (
                  <div className="boardItemPrice2">{price}</div>
                ) : (
                  <div className="boardItemPrice2 boardItemPrice2No">договор</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="boardFooter">
        <div className="boardWatermark">PROVHUB · MTA PROVINCE</div>
        <div className="boardStats">{formatDateRu(new Date())}</div>
      </div>
    </div>
  );
}
