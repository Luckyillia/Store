import React from 'react';
import { Icon } from './Icon';
import { LicensePlate } from './LicensePlate';

export function SaleList({ 
  items, onRemoveItem, onClearAll, onSetQty, onSetPrice, 
  seller, setSeller, catalogOpen, setCatalogOpen,
  plateItems, onRemovePlate, onSetPlatePrice, onClearPlates
}) {
  const hasPlates = plateItems && plateItems.length > 0;
  const hasItems = items && items.length > 0;

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
            {(items.length + (plateItems?.length || 0)) > 0 ? (
              <span style={{ color: 'var(--accent)', fontSize: 12 }}>
                ({items.length + (plateItems?.length || 0)})
              </span>
            ) : null}
          </h2>
        </div>
        <button type="button" className="btnClear" onClick={onClearAll}>
          Очистить
        </button>
      </div>

      <div className="saleList">
        {!hasItems && !hasPlates ? (
          <div className="saleEmpty">
            Нажимай на предметы в каталоге
            <br />или добавляй номера сверху
          </div>
        ) : (
          <>
            {/* Regular items */}
            {items.map((s, idx) => (
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
                  <button type="button" className="qtyBtn" onClick={() => onSetQty(idx, s.qty - 1)}>−</button>
                  <span className="qtyVal">{s.qty}</span>
                  <button type="button" className="qtyBtn" onClick={() => onSetQty(idx, s.qty + 1)}>+</button>
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
            ))}

            {/* Plates section */}
            {hasPlates && (
              <>
                <div className="platesListDivider">
                  <span>Номера</span>
                  <button type="button" className="btnClear" onClick={onClearPlates} style={{ fontSize: 10 }}>
                    Очистить
                  </button>
                </div>

                {plateItems.map((p) => (
                  <div className="saleRow saleRow--plate" key={p.key}>
                    <div className="plateRowPreview">
                      <LicensePlate number={p.number} region={p.region} size="tiny" />
                    </div>

                    <div className="itemInfo">
                      <p className="saleRowName" style={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                        {p.number}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text3)', margin: 0 }}>Регион {p.region}</p>
                    </div>

                    <div className="saleRowPrice">
                      <input
                        type="text"
                        value={p.price}
                        placeholder="Цена $"
                        onChange={(e) => onSetPlatePrice(p.key, e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      className="delBtn"
                      onClick={() => onRemovePlate(p.key)}
                      aria-label="Удалить"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
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
