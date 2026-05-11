import React from 'react';
import { Icon } from './Icon';

export function SaleList({ items, onRemoveItem, onClearAll, onSetQty, onSetPrice, seller, setSeller, catalogOpen, setCatalogOpen }) {
  return (
    <>
      <div className="saleListHeader">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className={`catalogToggleBtn${catalogOpen ? ' catalogToggleBtn--open' : ''}`}
            onClick={() => setCatalogOpen((v) => !v)}
            title={catalogOpen ? 'Скрыть каталог' : 'Показать каталог'}
          >
            {catalogOpen ? '◀' : '▶'}
          </button>
          <h2>
            Добавлено{' '}
            {items.length ? (
              <span style={{ color: 'var(--accent)', fontSize: 12 }}>
                ({items.length})
              </span>
            ) : null}
          </h2>
        </div>
        <button type="button" className="btnClear" onClick={onClearAll}>
          Очистить
        </button>
      </div>

      <div className="saleList">
        {!items.length ? (
          <div className="saleEmpty">
            Нажимай на предметы в каталоге
            <br />или добавляй через поиск
          </div>
        ) : (
          items.map((s, idx) => (
            <div className="saleRow" key={s.key}>
              <Icon item={s.item} />

              <div className="itemInfo">
                <p className="saleRowName">{s.item.name}</p>
              </div>

              <div className="saleRowPrice">
                <input
                  type="text"
                  value={s.price}
                  placeholder="Цена $"
                  onChange={(e) => onSetPrice(idx, e.target.value)}
                />
              </div>

              <div className="qtyWrap">
                <button
                  type="button"
                  className="qtyBtn"
                  onClick={() => onSetQty(idx, s.qty - 1)}
                >
                  −
                </button>
                <span className="qtyVal">{s.qty}</span>
                <button
                  type="button"
                  className="qtyBtn"
                  onClick={() => onSetQty(idx, s.qty + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="delBtn"
                onClick={() => onRemoveItem(idx)}
                aria-label="Удалить"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebarBottom">
        <input
          className="sellerInput"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
          placeholder="Ваш ник / контакт для покупателя"
        />
      </div>
    </>
  );
}
