import React from 'react';

export function LicensePlate({ number = '', region = '77', size = 'normal' }) {
  const isTiny   = size === 'tiny';
  const isSmall  = size === 'small';
  const isMedium = size === 'medium';
  const scale    = isTiny ? 0.48 : isSmall ? 0.68 : isMedium ? 0.82 : 1;

  const cleaned = number.replace(/\s+/g, '').toUpperCase();
  const match   = cleaned.match(/^([А-ЯA-Z])(\d{1,3})([А-ЯA-Z]{1,2})$/);

  let displayLeft  = '';
  let displayMid   = '';
  let displayRight = '';

  if (match) {
    displayLeft  = match[1];
    displayMid   = match[2].padStart(3, '0');
    displayRight = match[3];
  } else {
    displayMid = cleaned || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
  }

  return (
    <div
      style={{
        display:         'inline-block',
        transformOrigin: 'top left',
        transform:       `scale(${scale})`,
        lineHeight:      0,
      }}
    >
      <div style={{
        display:      'flex',
        alignItems:   'stretch',
        width:        340,
        height:       76,
        background:   '#c4c4c4',
        borderRadius: 8,
        border:       '3px solid #1a1a1a',
        overflow:     'hidden',
        boxShadow:    '0 3px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.3)',
        fontFamily:   '"Arial Black", "Arial Bold", Arial, sans-serif',
        userSelect:   'none',
        position:     'relative',
      }}>

        {/* Main number area */}
        <div style={{
          flex:           1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          paddingLeft:    8,
          paddingRight:   4,
        }}>
          {match ? (
            <>
              <span style={letterStyle}>{displayLeft}</span>
              <span style={gapStyle} />
              <span style={digitsStyle}>{displayMid}</span>
              <span style={gapStyle} />
              <span style={letterStyle}>{displayRight}</span>
            </>
          ) : (
            <span style={{ ...digitsStyle, letterSpacing: 3 }}>{displayMid}</span>
          )}
        </div>

        {/* Vertical divider */}
        <div style={{
          width:      2,
          background: '#444',
          flexShrink: 0,
          alignSelf:  'stretch',
          margin:     '5px 0',
        }} />

        {/* Region + RUS + flag */}
        <div style={{
          width:          64,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          padding:        '4px 4px',
          gap:            1,
        }}>
          <div style={{
            fontSize:      28,
            fontWeight:    900,
            color:         '#111',
            lineHeight:    1,
            letterSpacing: -1,
            fontFamily:    '"Arial Black", "Arial Bold", Arial, sans-serif',
          }}>
            {region || '77'}
          </div>

          <div style={{
            fontSize:      9,
            fontWeight:    700,
            color:         '#222',
            letterSpacing: 1.5,
            fontFamily:    'Arial, sans-serif',
            lineHeight:    1,
            marginTop:     1,
          }}>
            RUS
          </div>

          {/* Tricolor flag */}
          <div style={{
            width:         30,
            height:        19,
            borderRadius:  2,
            overflow:      'hidden',
            border:        '0.5px solid rgba(0,0,0,0.3)',
            display:       'flex',
            flexDirection: 'column',
            marginTop:     2,
            flexShrink:    0,
          }}>
            <div style={{ flex: 1, background: '#fff' }} />
            <div style={{ flex: 1, background: '#003DA5' }} />
            <div style={{ flex: 1, background: '#D52B1E' }} />
          </div>
        </div>

      </div>
    </div>
  );
}

// Буквы меньше цифр, зазор между группами минимальный
const letterStyle = {
  fontSize:      36,
  fontWeight:    900,
  color:         '#111',
  lineHeight:    1,
  fontFamily:    '"Arial Black", "Arial Bold", Arial, sans-serif',
  letterSpacing: 0,
};

const digitsStyle = {
  fontSize:      46,
  fontWeight:    900,
  color:         '#111',
  lineHeight:    1,
  fontFamily:    '"Arial Black", "Arial Bold", Arial, sans-serif',
  letterSpacing: 2,
};

// Минимальный зазор между буквой и цифровым блоком
const gapStyle = {
  display:    'inline-block',
  width:      3,
  flexShrink: 0,
};
