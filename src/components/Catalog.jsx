import React from 'react';
import { getIconPath, getItemKey } from '../utils/helpers';

export function Catalog({ 
  items, 
  onAddItem, 
  filtersOpen, 
  setFiltersOpen, 
  hiddenTypes, 
  setHiddenTypes, 
  filterConfig,
  catalogQuery,
  setCatalogQuery,
  inputRef
}) {
  return (
    <>
      <div className="sidebarHeader">
        <div className="catalogHeader">
          <div
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: 11,
              color: 'var(--text2)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Каталог
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="catalogCount">Показано: {items.length}</div>
            <button
              type="button"
              className={`filterBurger${filtersOpen ? ' filterBurger--open' : ''}`}
              onClick={() => setFiltersOpen((v) => !v)}
              title="Фильтры"
              aria-label="Переключить фильтры"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <input
          className="searchInput"
          ref={inputRef}
          value={catalogQuery}
          onChange={(e) => setCatalogQuery(e.target.value)}
          placeholder="Фильтр каталога: текст / ID / категория..."
          autoComplete="off"
        />

        <div className={`filterPanel${filtersOpen ? ' filterPanel--open' : ''}`}>
          <div className="filterChips">
            {filterConfig.map((f) => {
              const active = !hiddenTypes[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  className={`filterChip${active ? ' filterChip--active' : ''}`}
                  onClick={() => setHiddenTypes((p) => ({ ...p, [f.key]: !p[f.key] }))}
                  title={active ? 'Скрыть ' + f.label : 'Показать ' + f.label}
                >
                  {active ? '✓ ' : ''}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="catalogGrid">
        {items.map((item) => (
          <div
            key={getItemKey(item)}
            className="catalogCard"
            onClick={() => onAddItem(item)}
          >
            <div className="catalogIcon">
              <img
                src={getIconPath(item) || ''}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="catalogName">{item.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
