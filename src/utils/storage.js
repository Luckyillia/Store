import { useEffect } from 'react';

export function useSaleState(STORAGE_KEY, setSeller, setCatalogQuery, setHiddenTypes, setSaleItems, getItemKey, FILTER_DEFAULTS) {
  // Load state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
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
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Sync state to localStorage immediately on any change
  // Note: App component calls this inside its own useEffect, 
  // but we can also provide a unified sync function or just keep the App's useEffect logic.
}

// Improved persistent sync with error handling and immediate save
export function saveSaleState(STORAGE_KEY, state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}
