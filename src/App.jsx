import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';

// Constants & Utils
import { 
  ITEMS_PER_CARD, 
  SKINS_PER_CARD, 
  STORAGE_KEY, 
  FILTER_CONFIG, 
  FILTER_DEFAULTS, 
  CATEGORY_ORDER 
} from './constants';
import { 
  getItemKey, 
  getItemCategory, 
} from './utils/helpers';
import { saveSaleState } from './utils/storage';

// Components
import { Catalog } from './components/Catalog';
import { SaleList } from './components/SaleList';
import { BoardCard } from './components/BoardCard';
import { SummaryCard } from './components/SummaryCard';
import { PlatesSection } from './components/PlatesSection';
import { PlatesBoardCard, PLATES_PER_CARD } from './components/PlatesBoardCard';

function App() {
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hiddenTypes, setHiddenTypes] = useState({ ...FILTER_DEFAULTS });
  const [seller, setSeller] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [plateItems, setPlateItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef(null);

  const [dbReady, setDbReady] = useState(false);

  const db = useMemo(() => {
    const raw = window.getAllItems ? window.getAllItems() : [];
    if (!Array.isArray(raw)) return [];
    return raw.filter((i) => i && typeof i.id === 'number' && i.name);
  }, [dbReady]);

  // Initial Load from LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        if (typeof parsed?.seller === 'string') setSeller(parsed.seller);
        if (typeof parsed?.catalogQuery === 'string') setCatalogQuery(parsed.catalogQuery);
        if (parsed?.hiddenTypes && typeof parsed.hiddenTypes === 'object') {
          setHiddenTypes({ ...FILTER_DEFAULTS, ...parsed.hiddenTypes });
        }

        if (Array.isArray(parsed?.saleItems)) {
          const migrated = parsed.saleItems
            .filter((s) => s && s.item)
            .map((s) => {
              const key = typeof s.key === 'string' && s.key ? s.key : getItemKey(s.item);
              const qty = Math.max(1, Number(s.qty) || 1);
              const price = typeof s.price === 'string' ? s.price : '';
              return { key, item: s.item, qty, price };
            });
          setSaleItems(migrated);
        }

        if (Array.isArray(parsed?.plateItems)) {
          setPlateItems(parsed.plateItems);
        }
      }
    } catch (e) {
      console.error('LocalStorage load failed', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    
    saveSaleState(STORAGE_KEY, {
      seller,
      catalogQuery,
      hiddenTypes,
      saleItems,
      plateItems,
    });
  }, [seller, catalogQuery, hiddenTypes, saleItems, plateItems, isLoaded]);

  // Database Readiness Check
  useEffect(() => {
    function checkReady() {
      if (window.getAllItems && Array.isArray(window.getAllItems())) {
        setDbReady(true);
        return true;
      }
      return false;
    }
    if (!checkReady()) {
      const timer = setInterval(() => {
        if (checkReady()) clearInterval(timer);
      }, 100);
      return () => clearInterval(timer);
    }
  }, []);

  const filteredDb = useMemo(() => {
    return db.filter((item) => {
      const cat = getItemCategory(item);
      return !hiddenTypes[cat];
    });
  }, [db, hiddenTypes]);

  const catalogItems = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    if (!q) return filteredDb;
    return filteredDb.filter((i) => {
      const name = String(i.name || '').toLowerCase();
      const type = String(i.type || '').toLowerCase();
      const event = String(i.event || '').toLowerCase();
      return (
        name.includes(q) ||
        type.includes(q) ||
        event.includes(q) ||
        String(i.id).includes(q)
      );
    });
  }, [catalogQuery, filteredDb]);

  function addItem(item) {
    const key = getItemKey(item);
    setSaleItems((prev) => {
      const idx = prev.findIndex((s) => s.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { key, item, qty: 1, price: '' }];
    });
  }

  function removeItem(index) {
    setSaleItems((prev) => prev.filter((_, i) => i !== index));
  }

  function clearAll() {
    if (window.confirm('Очистить весь список?')) {
      setSaleItems([]);
    }
  }

  function setQty(index, nextQty) {
    setSaleItems((prev) => {
      const next = [...prev];
      const clamped = Math.max(1, Number(nextQty) || 1);
      next[index] = { ...next[index], qty: clamped };
      return next;
    });
  }

  function setPrice(index, nextPrice) {
    setSaleItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], price: nextPrice };
      return next;
    });
  }

  // ── Plates ──
  function addPlate({ number, region, price }) {
    const key = `plate::${number}::${region}::${Date.now()}`;
    setPlateItems((prev) => [...prev, { key, number, region, price }]);
  }

  function removePlate(key) {
    setPlateItems((prev) => prev.filter((p) => p.key !== key));
  }

  function setPlatePrice(key, price) {
    setPlateItems((prev) =>
      prev.map((p) => p.key === key ? { ...p, price } : p)
    );
  }

  function clearPlates() {
    if (window.confirm('Очистить все номера?')) {
      setPlateItems([]);
    }
  }

  function getCategoryOrder(item) {
    const type = String(item?.item?.type || '');
    const idx = CATEGORY_ORDER.indexOf(type);
    return idx === -1 ? CATEGORY_ORDER.length : idx;
  }

  const { itemCards, skinCards } = useMemo(() => {
    const skins = saleItems.filter((s) => s.item?.type === 'Скин');
    const items = saleItems.filter((s) => s.item?.type !== 'Скин');

    const sortedItems = [...items].sort((a, b) => {
      const ao = getCategoryOrder(a);
      const bo = getCategoryOrder(b);
      if (ao !== bo) return ao - bo;
      return String(a.item?.name || '').localeCompare(String(b.item?.name || ''), 'ru');
    });
    
    const itemCardsArr = [];
    for (let i = 0; i < sortedItems.length; i += ITEMS_PER_CARD) {
      itemCardsArr.push(sortedItems.slice(i, i + ITEMS_PER_CARD));
    }

    const sortedSkins = [...skins].sort((a, b) => {
      return String(a.item?.name || '').localeCompare(String(b.item?.name || ''), 'ru');
    });
    
    const skinCardsArr = [];
    for (let i = 0; i < sortedSkins.length; i += SKINS_PER_CARD) {
      skinCardsArr.push(sortedSkins.slice(i, i + SKINS_PER_CARD));
    }

    return { itemCards: itemCardsArr, skinCards: skinCardsArr };
  }, [saleItems]);

  // Plate cards
  const plateCards = useMemo(() => {
    const cards = [];
    for (let i = 0; i < plateItems.length; i += PLATES_PER_CARD) {
      cards.push(plateItems.slice(i, i + PLATES_PER_CARD));
    }
    return cards;
  }, [plateItems]);

  const totalCards = itemCards.length + skinCards.length + plateCards.length;

  return (
    <div className={`app${catalogOpen ? '' : ' app--catalogHidden'}`}>
      {/* LEFT SIDEBAR: CATALOG */}
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

        {/* Plates section above catalog */}
        <PlatesSection onAddPlate={addPlate} />

        <Catalog 
          items={catalogItems}
          onAddItem={addItem}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          hiddenTypes={hiddenTypes}
          setHiddenTypes={setHiddenTypes}
          filterConfig={FILTER_CONFIG}
          catalogQuery={catalogQuery}
          setCatalogQuery={setCatalogQuery}
          inputRef={inputRef}
        />
      </div>

      {/* MIDDLE SIDEBAR: ADDED ITEMS */}
      <div className="sidebarSecondary">
        <SaleList 
          items={saleItems}
          onRemoveItem={removeItem}
          onClearAll={clearAll}
          onSetQty={setQty}
          onSetPrice={setPrice}
          seller={seller}
          setSeller={setSeller}
          catalogOpen={catalogOpen}
          setCatalogOpen={setCatalogOpen}
          plateItems={plateItems}
          onRemovePlate={removePlate}
          onSetPlatePrice={setPlatePrice}
          onClearPlates={clearPlates}
        />
      </div>

      {/* MAIN AREA: PREVIEW */}
      <div className="main">
        <div className="mainHeader">
          <h2>
            Предпросмотр (сеткой)
            {totalCards > 1 && (
              <span className="headerCardsCount">
                — {totalCards} объявлен{totalCards === 2 ? 'ия' : totalCards <= 4 ? 'ия' : 'ий'}
              </span>
            )}
          </h2>
        </div>

        <div className="previewArea">
          {!saleItems.length && !plateItems.length ? (
            <div className="noPreview">
              Добавь предметы — справа появится карточка для скрина
            </div>
          ) : (
            <>
              {itemCards.map((cardItems, idx) => (
                <BoardCard 
                  key={`item-card-${idx}`}
                  cardItems={cardItems}
                  cardNumber={idx + 1}
                  totalCards={totalCards}
                  seller={seller}
                />
              ))}

              {skinCards.map((cardItems, idx) => (
                <BoardCard 
                  key={`skin-card-${idx}`}
                  cardItems={cardItems}
                  cardNumber={itemCards.length + idx + 1}
                  totalCards={totalCards}
                  seller={seller}
                  isSkins={true}
                />
              ))}

              {plateCards.map((cardItems, idx) => (
                <PlatesBoardCard
                  key={`plate-card-${idx}`}
                  plateItems={cardItems}
                  cardNumber={itemCards.length + skinCards.length + idx + 1}
                  totalCards={totalCards}
                  seller={seller}
                />
              ))}

              <SummaryCard saleItems={saleItems} plateItems={plateItems} seller={seller} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
