import React, { useState, useRef } from 'react';
import { LicensePlate } from './LicensePlate';

export function PlatesSection({ onAddPlate }) {
  const [number, setNumber] = useState('');
  const [region, setRegion] = useState('77');
  const [price, setPrice] = useState('');
  const inputRef = useRef(null);

  function handleAdd() {
    const trimmed = number.trim();
    if (!trimmed) return;
    onAddPlate({ number: trimmed, region: region.trim() || '77', price });
    setNumber('');
    setPrice('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  const hasNumber = number.trim().length > 0;

  return (
    <div className="platesSection">
      <div className="platesSectionTitle">
        <span className="platesSectionIcon">🚗</span>
        Добавить номер
      </div>

      {/* Live preview */}
      <div className="platesPreviewWrap">
        {hasNumber ? (
          <div className="platesPreviewLive">
            <LicensePlate number={number} region={region} size="normal" />
          </div>
        ) : (
          <div className="platesPreviewEmpty">
            Введи номер — увидишь превью
          </div>
        )}
      </div>

      {/* Inputs */}
      <div className="platesInputRow">
        <input
          ref={inputRef}
          className="platesInput platesInput--number"
          value={number}
          onChange={e => setNumber(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="А123БВ"
          maxLength={9}
          spellCheck={false}
        />
        <input
          className="platesInput platesInput--region"
          value={region}
          onChange={e => setRegion(e.target.value.replace(/\D/g, '').slice(0, 3))}
          onKeyDown={handleKeyDown}
          placeholder="77"
          maxLength={3}
        />
      </div>

      <div className="platesInputRow">
        <input
          className="platesInput platesInput--price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Цена $"
        />
        <button
          type="button"
          className="platesAddBtn"
          onClick={handleAdd}
          disabled={!hasNumber || !price.trim()}
        >
          + Добавить
        </button>
      </div>
    </div>
  );
}
