import { useEffect, useMemo, useRef, useState } from 'react';

// Constants & Utils
import {
  ITEMS_PER_CARD,
  SKINS_PER_CARD,
  STORAGE_KEY,
  FILTER_CONFIG,
  FILTER_DEFAULTS,
  CATEGORY_ORDER,
  SORT_OPTIONS,
} from './constants';
import {
  getItemKey,
  getItemCategory,
  getEventKey,
  getUniqueEvents,
  sortItems,
  makeSetKey,
  NO_EVENT_KEY,
  NO_EVENT_LABEL,
} from './utils/helpers';
import { saveSaleState } from './utils/storage';

// Components
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { SaleList } from './components/SaleList';
import { BoardCard } from './components/BoardCard';
import { SummaryCard } from './components/SummaryCard';
import { PlatesSection } from './components/PlatesSection';
import { PlatesBoardCard, PLATES_PER_CARD } from './components/PlatesBoardCard';
import { SetBuilderBar } from './components/SetBuilderBar';
import { SetBoardCard } from './components/SetBoardCard';

function App() {
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [hiddenTypes, setHiddenTypes] = useState({ ...FILTER_DEFAULTS });
  const [eventFilter, setEventFilter] = useState(new Set());
  const [sortOption, setSortOption] = useState('default');
  const [seller, setSeller] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [plateItems, setPlateItems] = useState([]);
  const [setItems, setSetItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef(null);

  // Sets: selection state (catalog & cart)
  const [catalogSelectMode, setCatalogSelectMode] = useState(false);
  const [catalogSelection, setCatalogSelection] = useState(new Map());
  const [cartSelectMode, setCartSelectMode] = useState(false);
  const [cartSelection, setCartSelection] = useState(new Set());

  const [dbReady, setDbReady] = useState(false);

  const db = useMemo(() => {
    const raw = window.getAllItems ? window.getAllItems() : [];
    if (!Array.isArray(raw)) return [];
    return raw.filter((i) => i && typeof i.id === 'number' && i.name);
  }, [dbReady]);

  // Initial load from localStorage
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
        if (Array.isArray(parsed?.eventFilter)) {
          setEventFilter(new Set(parsed.eventFilter));
        }
        if (typeof parsed?.sortOption === 'string') {
          setSortOption(parsed.sortOption);
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

        if (Array.isArray(parsed?.setItems)) {
          const migratedSets = parsed.setItems
            .filter((s) => s && Array.isArray(s.components) && s.components.length > 0)
            .map((s) => ({
              key: typeof s.key === 'string' && s.key ? s.key : makeSetKey(),
              name: typeof s.name === 'string' ? s.name : 'Сет',
              price: typeof s.price === 'string' ? s.price : '',
              qty: Math.max(1, Number(s.qty) || 1),
              mode: s.mode === 'grouped' ? 'grouped' : 'collage',
              components: s.components,
            }));
          setSetItems(migratedSets);
        }
      }
    } catch (e) {
      console.error('LocalStorage load failed', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;

    saveSaleState(STORAGE_KEY, {
      seller,
      catalogQuery,
      hiddenTypes,
      eventFilter: Array.from(eventFilter),
      sortOption,
      saleItems,
      plateItems,
      setItems,
    });
  }, [seller, catalogQuery, hiddenTypes, eventFilter, sortOption, saleItems, plateItems, setItems, isLoaded]);

  // Database readiness check
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

  const visibleTypes = useMemo(() => {
    const set = new Set();
    FILTER_CONFIG.forEach((f) => {
      if (!hiddenTypes[f.key]) set.add(f.key);
    });
    return set;
  }, [hiddenTypes]);

  function handleVisibleTypesChange(nextVisibleSet) {
    setHiddenTypes((prev) => {
      const next = { ...prev };
      FILTER_CONFIG.forEach((f) => {
        next[f.key] = !nextVisibleSet.has(f.key);
      });
      return next;
    });
  }

  const eventOptions = useMemo(() => {
    return getUniqueEvents(db).map((k) => ({
      key: k,
      label: k === NO_EVENT_KEY ? NO_EVENT_LABEL : k,
    }));
  }, [db]);

  const filteredDb = useMemo(() => {
    return db.filter((item) => {
      const cat = getItemCategory(item);
      if (hiddenTypes[cat]) return false;
      if (eventFilter.size > 0 && !eventFilter.has(getEventKey(item))) return false;
      return true;
    });
  }, [db, hiddenTypes, eventFilter]);

  const catalogItems = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    let list = filteredDb;
    if (q) {
      list = list.filter((i) => {
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
    }
    return sortItems(list, sortOption);
  }, [catalogQuery, filteredDb, sortOption]);

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

  // Plates
  function addPlate({ number, region, price }) {
    const key = `plate::${number}::${region}::${Date.now()}`;
    setPlateItems((prev) => [...prev, { key, number, region, price }]);
  }

  function removePlate(key) {
    setPlateItems((prev) => prev.filter((p) => p.key !== key));
  }

  function setPlatePrice(key, price) {
    setPlateItems((prev) => prev.map((p) => (p.key === key ? { ...p, price } : p)));
  }

  function clearPlates() {
    if (window.confirm('Очистить все номера?')) {
      setPlateItems([]);
    }
  }

  // ── Sets ──
  function addSet({ name, price, components }) {
    if (!components || components.length === 0) return;
    setSetItems((prev) => [
      ...prev,
      {
        key: makeSetKey(),
        name: name || `Сет #${prev.length + 1}`,
        price: price || '',
        qty: 1,
        mode: 'collage',
        components,
      },
    ]);
  }

  function removeSet(key) {
    setSetItems((prev) => prev.filter((s) => s.key !== key));
  }

  function updateSet(key, patch) {
    setSetItems((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s;
        const next = { ...s, ...patch };
        if (patch.qty !== undefined) next.qty = Math.max(1, Number(patch.qty) || 1);
        return next;
      })
    );
  }

  function removeSetComponent(setKey, componentKey) {
    setSetItems((prev) =>
      prev
        .map((s) =>
          s.key === setKey
            ? { ...s, components: s.components.filter((c) => c.key !== componentKey) }
            : s
        )
        .filter((s) => s.components.length > 0)
    );
  }

  function clearSets() {
    if (window.confirm('Удалить все сеты?')) {
      setSetItems([]);
    }
  }

  // Catalog multi-select -> set
  function toggleCatalogSelectMode() {
    setCatalogSelectMode((v) => {
      const next = !v;
      if (!next) setCatalogSelection(new Map());
      return next;
    });
  }

  function toggleCatalogSelectItem(item) {
    const key = getItemKey(item);
    setCatalogSelection((prev) => {
      const next = new Map(prev);
      if (next.has(key)) next.delete(key);
      else next.set(key, item);
      return next;
    });
  }

  function cancelCatalogSelection() {
    setCatalogSelection(new Map());
  }

  function createSetFromCatalog({ name, price }) {
    const components = Array.from(catalogSelection.values()).map((item) => ({
      key: getItemKey(item),
      item,
      qty: 1,
    }));
    addSet({ name, price, components });
    setCatalogSelection(new Map());
    setCatalogSelectMode(false);
  }

  // Cart multi-select -> set
  function toggleCartSelectMode() {
    setCartSelectMode((v) => {
      const next = !v;
      if (!next) setCartSelection(new Set());
      return next;
    });
  }

  function toggleCartSelectItem(key) {
    setCartSelection((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function cancelCartSelection() {
    setCartSelection(new Set());
  }

  function createSetFromCart({ name, price }) {
    const chosen = saleItems.filter((s) => cartSelection.has(s.key));
    if (!chosen.length) return;
    const components = chosen.map((s) => ({ key: s.key, item: s.item, qty: s.qty }));
    addSet({ name, price, components });
    setSaleItems((prev) => prev.filter((s) => !cartSelection.has(s.key)));
    setCartSelection(new Set());
    setCartSelectMode(false);
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

    const sortedSkins = [...skins].sort((a, b) =>
      String(a.item?.name || '').localeCompare(String(b.item?.name || ''), 'ru')
    );

    const skinCardsArr = [];
    for (let i = 0; i < sortedSkins.length; i += SKINS_PER_CARD) {
      skinCardsArr.push(sortedSkins.slice(i, i + SKINS_PER_CARD));
    }

    return { itemCards: itemCardsArr, skinCards: skinCardsArr };
  }, [saleItems]);

  const plateCards = useMemo(() => {
    const cards = [];
    for (let i = 0; i < plateItems.length; i += PLATES_PER_CARD) {
      cards.push(plateItems.slice(i, i + PLATES_PER_CARD));
    }
    return cards;
  }, [plateItems]);

  const totalCards = itemCards.length + skinCards.length + plateCards.length + setItems.length;
  const totalAdded = saleItems.length + plateItems.length + setItems.length;

  return (
    <div className="flex h-screen flex-col bg-base text-ink">
      <Header totalAdded={totalAdded} seller={seller} />

      <div className="flex flex-1 overflow-hidden">
        {/* Catalog sidebar */}
        <div
          className={`flex shrink-0 flex-col overflow-hidden border-r border-hair bg-panel transition-[width] duration-200 ${
            catalogOpen ? 'w-[400px]' : 'w-0 border-r-0'
          }`}
        >
          <div className="flex h-full min-h-0 w-[400px] flex-col">
            <PlatesSection onAddPlate={addPlate} />
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <Catalog
                  items={catalogItems}
                  onAddItem={addItem}
                  typeOptions={FILTER_CONFIG}
                  visibleTypes={visibleTypes}
                  onVisibleTypesChange={handleVisibleTypesChange}
                  eventOptions={eventOptions}
                  eventFilter={eventFilter}
                  setEventFilter={setEventFilter}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  catalogQuery={catalogQuery}
                  setCatalogQuery={setCatalogQuery}
                  inputRef={inputRef}
                  selectMode={catalogSelectMode}
                  onToggleSelectMode={toggleCatalogSelectMode}
                  selectedKeys={new Set(catalogSelection.keys())}
                  onToggleSelectItem={toggleCatalogSelectItem}
                />
              </div>
              {catalogSelectMode && catalogSelection.size > 0 && (
                <SetBuilderBar
                  count={catalogSelection.size}
                  onCreate={createSetFromCatalog}
                  onCancel={cancelCatalogSelection}
                />
              )}
            </div>
          </div>
        </div>

        {/* Cart / added items */}
        <div className="flex w-[360px] shrink-0 flex-col border-r border-hair bg-panel">
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
            sets={setItems}
            onRemoveSet={removeSet}
            onUpdateSet={updateSet}
            onRemoveSetComponent={removeSetComponent}
            onClearSets={clearSets}
            cartSelectMode={cartSelectMode}
            onToggleCartSelectMode={toggleCartSelectMode}
            cartSelection={cartSelection}
            onToggleCartSelectItem={toggleCartSelectItem}
            onCreateSetFromCart={createSetFromCart}
            onCancelCartSelection={cancelCartSelection}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-hair px-6 py-4">
            <h2 className="font-display text-lg tracking-wide text-ink">
              Предпросмотр (сеткой)
              {totalCards > 1 && (
                <span className="ml-2 font-body text-xs font-normal text-mute">
                  — {totalCards} объявлен
                  {totalCards === 2 ? 'ия' : totalCards <= 4 ? 'ия' : 'ий'}
                </span>
              )}
            </h2>
          </div>

          <div className="scroll-thin flex flex-1 flex-col items-center gap-6 overflow-y-auto p-6">
            {!saleItems.length && !plateItems.length && !setItems.length ? (
              <div className="flex flex-1 items-center justify-center px-10 py-20 text-center font-body text-sm text-mute">
                Добавь предметы — здесь появится карточка для скрина
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
                    isSkins
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

                {setItems.length > 0 && (
                  <div className="flex w-full max-w-[1160px] flex-wrap items-start justify-center gap-6">
                    {setItems.map((s, idx) => (
                      <SetBoardCard
                        key={`set-card-${s.key}`}
                        set={s}
                        cardNumber={itemCards.length + skinCards.length + plateCards.length + idx + 1}
                        totalCards={totalCards}
                        seller={seller}
                      />
                    ))}
                  </div>
                )}

                <SummaryCard saleItems={saleItems} plateItems={plateItems} sets={setItems} seller={seller} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;