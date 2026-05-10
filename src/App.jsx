import './App.css'

import { useEffect, useMemo, useRef, useState } from 'react'

const ITEMS_PER_CARD = 24 // 4 rows × 6 cols

function getIconPath(item) {
  const badgeImage = item?.badgeImage
  if (badgeImage && typeof badgeImage === 'string') {
    return badgeImage.replace('../', '/').replace(/^\/?/, '/')
  }

  const img = item?.img
  if (img && typeof img === 'string') {
    return img.replace('../', '/').replace(/^\/?/, '/')
  }

  if (!item?.id) return null
  return `/icons/${item.id}.png`
}

function makeFallbackText(name) {
  if (!name) return '??'
  const words = String(name).trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return String(name).slice(0, 2).toUpperCase()
}

function Icon({ item }) {
  const [failed, setFailed] = useState(false)
  const src = getIconPath(item)

  return (
    <div className="itemIcon">
      {!failed && src ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <div className="fallback">{makeFallbackText(item?.name)}</div>
      )}
    </div>
  )
}

function formatDateRu(date) {
  return date.toLocaleDateString('ru-RU')
}

function getItemKey(item) {
  const idPart = typeof item?.id === 'number' ? String(item.id) : 'noid'
  const variant = item?.badgeImage || item?.img || item?.name || ''
  return `${idPart}::${variant}`
}

const STORAGE_KEY = 'ph_sale_state_v1'

function App() {
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [hiddenTypes, setHiddenTypes] = useState({
    food: true,
    drinks: true,
    medicine: true,
    weapons: true,
    ammo: true,
    junk: true,
  })
  const [seller, setSeller] = useState('')
  const [saleItems, setSaleItems] = useState([])
  const inputRef = useRef(null)

  const db = useMemo(() => {
    const raw = window.itemsDatabase
    if (!Array.isArray(raw)) return []
    return raw.filter((i) => i && typeof i.id === 'number' && i.name)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)

      if (typeof parsed?.seller === 'string') setSeller(parsed.seller)
      if (typeof parsed?.catalogQuery === 'string') setCatalogQuery(parsed.catalogQuery)
      if (parsed?.hiddenTypes && typeof parsed.hiddenTypes === 'object') {
        setHiddenTypes((prev) => ({ ...prev, ...parsed.hiddenTypes }))
      }

      if (Array.isArray(parsed?.saleItems)) {
        const migrated = parsed.saleItems
          .filter((s) => s && s.item)
          .map((s) => {
            const key = typeof s.key === 'string' && s.key ? s.key : getItemKey(s.item)
            const qty = Math.max(1, Number(s.qty) || 1)
            const price = typeof s.price === 'string' ? s.price : ''
            return { key, item: s.item, qty, price }
          })
        setSaleItems(migrated)
      }
    } catch {
      // ignore bad localStorage
    }
  }, [])

  useEffect(() => {
    try {
      const payload = {
        seller,
        catalogQuery,
        hiddenTypes,
        saleItems,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore quota / serialization errors
    }
  }, [seller, catalogQuery, hiddenTypes, saleItems])

  const filteredDb = useMemo(() => {
    function shouldHide(item) {
      const type = String(item?.type || '').toLowerCase()
      const name = String(item?.name || '').toLowerCase()

      const isHandItem = type.includes('предмет в руки')

      if (hiddenTypes.food) {
        if (type.includes('еда')) return true
      }

      if (hiddenTypes.drinks) {
        if (isHandItem) {
          const drinkKeywords = [
            'вода',
            'газиров',
            'сок',
            'квас',
            'пиво',
            'сидр',
            'эль',
            'вино',
            'виски',
            'ликер',
            'абсент',
            'молоко',
            'чай',
            'кофе',
          ]
          if (drinkKeywords.some((k) => name.includes(k))) return true
        }
      }

      if (hiddenTypes.medicine) {
        if (type.includes('лекар')) return true
      }

      if (hiddenTypes.weapons) {
        if (type.includes('оруж')) return true
      }

      if (hiddenTypes.ammo) {
        if (type.includes('патрон')) return true
        if (name.includes('патрон')) return true
      }

      if (hiddenTypes.junk) {
        const junkKeywords = [
          'бревно',
          'наживк',
          'удочк',
          'рыб',
          'руда',
          'доски',
          'доска',
          'брев',
          'уголь',
          'камень',
          'гриб',
          'томат',
          'картоф',
          'перец',
          'мясо',
          'курица',
          'хек',
        ]
        const junkTypeKeywords = ['рыбал', 'ингредиент', 'ресурс', 'материал', 'сырь']
        if (junkTypeKeywords.some((k) => type.includes(k))) return true
        if (junkKeywords.some((k) => name.includes(k))) return true
      }

      return false
    }

    return db.filter((i) => !shouldHide(i))
  }, [db, hiddenTypes])

  const catalogItems = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase()
    if (!q) return filteredDb.slice(0, 220)
    return filteredDb
      .filter((i) => {
        const name = String(i.name || '').toLowerCase()
        const type = String(i.type || '').toLowerCase()
        const event = String(i.event || '').toLowerCase()
        return (
          name.includes(q) ||
          type.includes(q) ||
          event.includes(q) ||
          String(i.id).includes(q)
        )
      })
      .slice(0, 220)
  }, [catalogQuery, filteredDb])

  useEffect(() => {
    function onDocMouseDown(e) {
      const input = inputRef.current
      if (!input) return
      if (!input.contains(e.target)) {
        return
      }
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  function addItem(item) {
    const key = getItemKey(item)
    setSaleItems((prev) => {
      const idx = prev.findIndex((s) => s.key === key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { key, item, qty: 1, price: '' }]
    })
  }

  function removeItem(index) {
    setSaleItems((prev) => prev.filter((_, i) => i !== index))
  }

  function clearAll() {
    setSaleItems([])
  }

  function setQty(index, nextQty) {
    setSaleItems((prev) => {
      const next = [...prev]
      const clamped = Math.max(1, Number(nextQty) || 1)
      next[index] = { ...next[index], qty: clamped }
      return next
    })
  }

  function setPrice(index, nextPrice) {
    setSaleItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], price: nextPrice }
      return next
    })
  }

  // Sort saleItems by category before splitting into cards
  const CATEGORY_ORDER = [
    'Спортивные колеса',
    'Стандартные колеса',
    'Внедорожные колеса',
    'Японская классика',
    'Американская классика',
    'Классические колеса',
    'Советская классика',
    'Номерная рамка',
    'Винил',
    'Рюкзак',
    'Головной убор',
    'Очки',
    'Маска',
    'Аксессуар для спины',
    'Аксессуар для руки',
    'Лекарство',
    'Расходный материал',
    'Предмет в руки',
    'Еда',
    'Оружие',
    'Фракционное оружие',
    'Фракционные патроны',
    'Парашют',
  ]

  function getCategoryOrder(item) {
    const type = String(item?.item?.type || '')
    const idx = CATEGORY_ORDER.indexOf(type)
    return idx === -1 ? CATEGORY_ORDER.length : idx
  }

  const previewCards = useMemo(() => {
    const sorted = [...saleItems].sort((a, b) => {
      const ao = getCategoryOrder(a)
      const bo = getCategoryOrder(b)
      if (ao !== bo) return ao - bo
      // Within same category sort by name
      return String(a.item?.name || '').localeCompare(String(b.item?.name || ''), 'ru')
    })
    const cards = []
    for (let i = 0; i < sorted.length; i += ITEMS_PER_CARD) {
      cards.push(sorted.slice(i, i + ITEMS_PER_CARD))
    }
    return cards
  }, [saleItems])

  const totalCards = previewCards.length

  return (
    <div className={`app${catalogOpen ? '' : ' app--catalogHidden'}`}>
      <div className={`sidebar${catalogOpen ? '' : ' sidebar--hidden'}`}>
        <div className="sidebarHeader">
          <div className="logo">
            <div className="logoIcon">PH</div>
            <div className="logoText">
              <h1>ProvHub</h1>
              <span>Доска продаж</span>
            </div>
          </div>
        </div>

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
              <div className="catalogCount">Показано: {catalogItems.length}</div>
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
            <div className="filterGrid">
              <label className="filterLabel">
                <input
                  type="checkbox"
                  checked={!hiddenTypes.food}
                  onChange={(e) => setHiddenTypes((p) => ({ ...p, food: !e.target.checked }))}
                />
                Еда
              </label>
              <label className="filterLabel">
                <input
                  type="checkbox"
                  checked={!hiddenTypes.drinks}
                  onChange={(e) => setHiddenTypes((p) => ({ ...p, drinks: !e.target.checked }))}
                />
                Напитки
              </label>
              <label className="filterLabel">
                <input
                  type="checkbox"
                  checked={!hiddenTypes.medicine}
                  onChange={(e) => setHiddenTypes((p) => ({ ...p, medicine: !e.target.checked }))}
                />
                Лекарства
              </label>
              <label className="filterLabel">
                <input
                  type="checkbox"
                  checked={!hiddenTypes.weapons}
                  onChange={(e) => setHiddenTypes((p) => ({ ...p, weapons: !e.target.checked }))}
                />
                Оружие
              </label>
              <label className="filterLabel">
                <input
                  type="checkbox"
                  checked={!hiddenTypes.ammo}
                  onChange={(e) => setHiddenTypes((p) => ({ ...p, ammo: !e.target.checked }))}
                />
                Патроны
              </label>
              <label className="filterLabel">
                <input
                  type="checkbox"
                  checked={!hiddenTypes.junk}
                  onChange={(e) => setHiddenTypes((p) => ({ ...p, junk: !e.target.checked }))}
                />
                Ресурсы/мусор
              </label>
            </div>
          </div>
        </div>

        <div className="catalogGrid">
          {catalogItems.map((item) => (
            <div
              key={getItemKey(item)}
              className="catalogCard"
              onClick={() => addItem(item)}
            >
              <div className="catalogIcon">
                <img
                  src={getIconPath(item) || ''}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="catalogName">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebarSecondary">
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
              {saleItems.length ? (
                <span style={{ color: 'var(--accent)', fontSize: 12 }}>
                  ({saleItems.length})
                </span>
              ) : null}
            </h2>
          </div>
          <button type="button" className="btnClear" onClick={clearAll}>
            Очистить
          </button>
        </div>

        <div className="saleList">
          {!saleItems.length ? (
            <div className="saleEmpty">
              Нажимай на предметы в каталоге
              <br />или добавляй через поиск
            </div>
          ) : (
            saleItems.map((s, idx) => (
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
                    onChange={(e) => setPrice(idx, e.target.value)}
                  />
                </div>

                <div className="qtyWrap">
                  <button
                    type="button"
                    className="qtyBtn"
                    onClick={() => setQty(idx, s.qty - 1)}
                  >
                    −
                  </button>
                  <span className="qtyVal">{s.qty}</span>
                  <button
                    type="button"
                    className="qtyBtn"
                    onClick={() => setQty(idx, s.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="delBtn"
                  onClick={() => removeItem(idx)}
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
      </div>

      <div className="main">
        <div className="mainHeader">
          <h2>
            Предпросмотр (сеткой)
            {totalCards > 1 && (
              <span style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'Manrope, sans-serif', fontWeight: 400, marginLeft: 10 }}>
                — {totalCards} объявлен{totalCards === 2 ? 'ия' : totalCards <= 4 ? 'ия' : 'ий'}
              </span>
            )}
          </h2>
        </div>

        <div className="previewArea">
          {!saleItems.length ? (
            <div className="noPreview">
              Добавь предметы — справа появится карточка для скрина
            </div>
          ) : (
            previewCards.map((cardItems, cardIdx) => (
              <div key={cardIdx} className="boardCard">
                {totalCards > 1 && (
                  <div className="boardCardBadge">
                    {cardIdx + 1} / {totalCards}
                  </div>
                )}
                <div className="boardTitleRow">
                  <div className="boardTitle">🏪 ПРОДАЮ</div>
                  {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
                </div>

                <div className="boardSubtitle">
                  {cardItems.length} позиц{cardItems.length === 1 ? 'ия' : cardItems.length <= 4 ? 'ии' : 'ий'}
                  {totalCards > 1 ? ` · часть ${cardIdx + 1} из ${totalCards}` : ''}
                  {' '}· MTA Province
                </div>
                <div className="boardDivider" />

                <div className="boardItems">
                  {cardItems.map((s) => {
                    const price = String(s.price || '').trim()
                    return (
                      <div className="boardItemCard" key={`${s.key}-card-${cardIdx}`}>
                        <div className="boardItemTop">
                          <div className="boardItemIcon">
                            <img
                              src={getIconPath(s.item) || ''}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
                            {s.qty > 1 ? `x${s.qty}` : ''}
                          </div>
                        </div>
                        <div className="boardItemBottom">
                          <div className="boardItemName2">{s.item.name}</div>
                          {price ? (
                            <div className="boardItemPrice2">{price}</div>
                          ) : (
                            <div className="boardItemPrice2 boardItemPrice2No">договор</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="boardFooter">
                  <div className="boardWatermark">PROVHUB · MTA PROVINCE</div>
                  <div className="boardStats">{formatDateRu(new Date())}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App