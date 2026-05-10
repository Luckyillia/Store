import './App.css'

import { useEffect, useMemo, useRef, useState } from 'react'

const ITEMS_PER_CARD = 24 // 4 rows × 6 cols
const SKINS_PER_CARD = 6  // 1 row × 6 cols for skins

function getIconPath(item) {
  const icon = item?.icon
  if (icon && typeof icon === 'string') {
    return icon.replace(/^\/?/, '/')
  }

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

function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') return 0
  const cleaned = priceStr.replace(/\s/g, '').replace(/,/g, '').replace(/\./g, '')
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? 0 : num
}

function formatNumber(num) {
  if (!num || num === 0) return '0'
  return num.toLocaleString('ru-RU')
}

function getItemKey(item) {
  const idPart = typeof item?.id === 'number' ? String(item.id) : 'noid'
  const variant = item?.badgeImage || item?.img || item?.name || ''
  return `${idPart}::${variant}`
}

const STORAGE_KEY = 'ph_sale_state_v2'

function getItemCategory(item) {
  const type = String(item?.type || '').trim()
  const name = String(item?.name || '').toLowerCase()

  if (type === 'Скин') return 'skins'
  if (['Маска', 'Головной убор', 'Аксессуар для руки', 'Аксессуар для спины', 'Очки', 'Парашют', 'Рюкзак'].includes(type)) return 'accessories'
  if (type === 'Винил') return 'vinyls'
  if (type === 'Номерная рамка') return 'frames'
  if (['Стандартные колеса', 'Спортивные колеса', 'Внедорожные колеса', 'Классические колеса', 'Американская классика', 'Советская классика', 'Японская классика'].includes(type)) return 'wheels'
  if (type === 'Еда') return 'food'
  if (type === 'Лекарство') return 'medicine'
  if (type === 'Оружие' || type === 'Фракционное оружие' || type === 'Фракционный аксессуар') return 'weapons'
  if (type === 'Фракционные патроны') return 'ammo'
  if (type === 'Расходный материал') return 'materials'
  if (type === 'Рабочий инструмент') return 'tools'
  if (type === 'Аудиокассета') return 'cassettes'
  if (type === 'Предмет в руки') {
    const drinkKeywords = ['вода', 'газиров', 'сок', 'квас', 'пиво', 'сидр', 'эль', 'вино', 'виски', 'ликер', 'абсент', 'молоко', 'чай', 'кофе', 'кола', 'лимонад', 'энергет']
    if (drinkKeywords.some((k) => name.includes(k))) return 'drinks'
    return 'hand'
  }
  if (type === 'Рецепт') return 'recipes'
  if (type === 'Подарок') return 'gifts'
  if (type === 'Опыт') return 'exp'
  return 'other'
}

const FILTER_CONFIG = [
  { key: 'skins', label: 'Скины' },
  { key: 'accessories', label: 'Аксессуары' },
  { key: 'vinyls', label: 'Винилы' },
  { key: 'frames', label: 'Рамки' },
  { key: 'wheels', label: 'Диски' },
  { key: 'food', label: 'Еда' },
  { key: 'drinks', label: 'Напитки' },
  { key: 'hand', label: 'В руки' },
  { key: 'medicine', label: 'Лекарства' },
  { key: 'weapons', label: 'Оружие' },
  { key: 'ammo', label: 'Патроны' },
  { key: 'materials', label: 'Расходники' },
  { key: 'tools', label: 'Инструменты' },
  { key: 'cassettes', label: 'Аудио' },
  { key: 'other', label: 'Неизвестные' },
]

const FILTER_DEFAULTS = {
  skins: false,
  accessories: false,
  vinyls: false,
  frames: false,
  wheels: false,
  food: true,
  drinks: true,
  hand: false,
  medicine: true,
  weapons: true,
  ammo: true,
  materials: true,
  tools: true,
  cassettes: false,
  recipes: false,
  gifts: false,
  exp: false,
  other: true,
}

function App() {
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [hiddenTypes, setHiddenTypes] = useState({ ...FILTER_DEFAULTS })
  const [seller, setSeller] = useState('')
  const [saleItems, setSaleItems] = useState([])
  const inputRef = useRef(null)

  const [dbReady, setDbReady] = useState(false)

  const db = useMemo(() => {
    const raw = window.getAllItems ? window.getAllItems() : []
    if (!Array.isArray(raw)) return []
    return raw.filter((i) => i && typeof i.id === 'number' && i.name)
  }, [dbReady])

  useEffect(() => {
    function checkReady() {
      if (window.getAllItems && Array.isArray(window.getAllItems())) {
        setDbReady(true)
        return true
      }
      return false
    }
    if (!checkReady()) {
      const timer = setInterval(() => {
        if (checkReady()) clearInterval(timer)
      }, 100)
      return () => clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)

      if (typeof parsed?.seller === 'string') setSeller(parsed.seller)
      if (typeof parsed?.catalogQuery === 'string') setCatalogQuery(parsed.catalogQuery)
      if (parsed?.hiddenTypes && typeof parsed.hiddenTypes === 'object') {
        setHiddenTypes({ ...FILTER_DEFAULTS, ...parsed.hiddenTypes })
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
    return db.filter((item) => {
      const cat = getItemCategory(item)
      return !hiddenTypes[cat]
    })
  }, [db, hiddenTypes])

  const catalogItems = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase()
    if (!q) return filteredDb
    return filteredDb.filter((i) => {
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
    'Скин',
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

  const { itemCards, skinCards } = useMemo(() => {
    const skins = saleItems.filter((s) => s.item?.type === 'Скин')
    const items = saleItems.filter((s) => s.item?.type !== 'Скин')

    const sortedItems = [...items].sort((a, b) => {
      const ao = getCategoryOrder(a)
      const bo = getCategoryOrder(b)
      if (ao !== bo) return ao - bo
      return String(a.item?.name || '').localeCompare(String(b.item?.name || ''), 'ru')
    })
    const itemCardsArr = []
    for (let i = 0; i < sortedItems.length; i += ITEMS_PER_CARD) {
      itemCardsArr.push(sortedItems.slice(i, i + ITEMS_PER_CARD))
    }

    const sortedSkins = [...skins].sort((a, b) => {
      return String(a.item?.name || '').localeCompare(String(b.item?.name || ''), 'ru')
    })
    const skinCardsArr = []
    for (let i = 0; i < sortedSkins.length; i += SKINS_PER_CARD) {
      skinCardsArr.push(sortedSkins.slice(i, i + SKINS_PER_CARD))
    }

    return { itemCards: itemCardsArr, skinCards: skinCardsArr }
  }, [saleItems])

  const totalCards = itemCards.length + skinCards.length

  return (
    <div className={`app${catalogOpen ? '' : ' app--catalogHidden'}`}>
      <div className={`sidebar${catalogOpen ? '' : ' sidebar--hidden'}`}>
        <div className="sidebarHeader">
          <div className="logo">
            <div className="logoIcon">SA</div>
            <div className="logoText">
              <h1>Sokirovskiy Accessory</h1>
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
            <div className="filterChips">
              {FILTER_CONFIG.map((f) => {
                const active = !hiddenTypes[f.key]
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
                )
              })}
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
            <>
              {/* Regular item cards */}
              {itemCards.map((cardItems, cardIdx) => {
                const cardNumber = cardIdx + 1
                return (
                  <div key={`item-${cardIdx}`} className="boardCard">
                    {totalCards > 1 && (
                      <div className="boardCardBadge">
                        {cardNumber} / {totalCards}
                      </div>
                    )}
                    <div className="boardTitleRow">
                      <div className="boardTitle">🏪 ПРОДАЮ</div>
                      {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
                    </div>

                    <div className="boardSubtitle">
                      {cardItems.length} позиц{cardItems.length === 1 ? 'ия' : cardItems.length <= 4 ? 'ии' : 'ий'}
                      {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''}
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
                )
              })}

              {/* Skin cards */}
              {skinCards.map((cardItems, cardIdx) => {
                const cardNumber = itemCards.length + cardIdx + 1
                return (
                  <div key={`skin-${cardIdx}`} className="boardCard boardCard--skins">
                    {totalCards > 1 && (
                      <div className="boardCardBadge">
                        {cardNumber} / {totalCards}
                      </div>
                    )}
                    <div className="boardTitleRow">
                      <div className="boardTitle">🏪 ПРОДАЮ СКИНЫ</div>
                      {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
                    </div>

                    <div className="boardSubtitle">
                      {cardItems.length} скин{cardItems.length === 1 ? '' : cardItems.length <= 4 ? 'а' : 'ов'}
                      {totalCards > 1 ? ` · часть ${cardNumber} из ${totalCards}` : ''}
                      {' '}· MTA Province
                    </div>
                    <div className="boardDivider" />

                    <div className="boardItems boardItems--skins">
                      {cardItems.map((s) => {
                        const price = String(s.price || '').trim()
                        return (
                          <div className="boardItemCard boardItemCard--skin" key={`${s.key}-skin-${cardIdx}`}>
                            <div className="boardItemTop boardItemTop--skin">
                              <div className="boardItemIcon boardItemIcon--skin">
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
                            <div className="boardItemBottom boardItemBottom--skin">
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
                )
              })}

              {/* Summary card */}
              <div className="boardCard boardCard--summary">
                <div className="boardTitleRow">
                  <div className="boardTitle">📊 ИТОГО</div>
                  {seller ? <div className="boardSellerTag">✉ {seller}</div> : null}
                </div>
                <div className="boardSubtitle">{saleItems.length} позиций всего · MTA Province</div>
                <div className="boardDivider" />
                <div className="summaryGrid">
                  {(() => {
                    const cats = {}
                    let totalSum = 0
                    saleItems.forEach((s) => {
                      const cat = getItemCategory(s.item)
                      if (!cats[cat]) cats[cat] = { count: 0, qty: 0, sum: 0 }
                      cats[cat].count += 1
                      cats[cat].qty += s.qty
                      const p = parsePrice(s.price)
                      cats[cat].sum += p * s.qty
                      totalSum += p * s.qty
                    })
                    const rows = Object.entries(cats)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([cat, data]) => {
                        const label = FILTER_CONFIG.find((f) => f.key === cat)?.label || cat
                        return (
                          <div className="summaryRow" key={cat}>
                            <span className="summaryLabel">{label}</span>
                            <span className="summaryValue">{data.qty} шт.{data.sum > 0 ? ' · $' + formatNumber(data.sum) : ''}</span>
                          </div>
                        )
                      })
                    rows.push(
                      <div className="summaryRow summaryRow--total" key="total">
                        <span className="summaryLabel">ОБЩАЯ СУММА</span>
                        <span className="summaryValue summaryValue--total">${formatNumber(totalSum)}</span>
                      </div>
                    )
                    return rows
                  })()}
                </div>
                <div className="boardFooter">
                  <div className="boardWatermark">PROVHUB · MTA PROVINCE</div>
                  <div className="boardStats">{formatDateRu(new Date())}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App