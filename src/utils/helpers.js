export function getIconPath(item) {
  const icon = item?.icon;
  if (icon && typeof icon === 'string') {
    return icon.replace(/^\/?/, '/');
  }

  const badgeImage = item?.badgeImage;
  if (badgeImage && typeof badgeImage === 'string') {
    return badgeImage.replace('../', '/').replace(/^\/?/, '/');
  }

  const img = item?.img;
  if (img && typeof img === 'string') {
    return img.replace('../', '/').replace(/^\/?/, '/');
  }

  if (!item?.id) return null;
  return `/icons/${item.id}.png`;
}

export function makeFallbackText(name) {
  if (!name) return '??';
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return String(name).slice(0, 2).toUpperCase();
}

export function formatDateRu(date) {
  return date.toLocaleDateString('ru-RU');
}

export function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') return 0;
  const cleaned = priceStr.replace(/\s/g, '').replace(/,/g, '').replace(/\./g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

export function formatNumber(num) {
  if (!num || num === 0) return '0';
  return num.toLocaleString('ru-RU');
}

export function getItemKey(item) {
  const idPart = typeof item?.id === 'number' ? String(item.id) : 'noid';
  const variant = item?.badgeImage || item?.img || item?.name || '';
  return `${idPart}::${variant}`;
}

export function getItemCategory(item) {
  const type = String(item?.type || '').trim();
  const name = String(item?.name || '').toLowerCase();

  if (type === 'Скин') return 'skins';
  if (['Маска', 'Головной убор', 'Аксессуар для руки', 'Аксессуар для спины', 'Очки', 'Парашют', 'Рюкзак'].includes(type)) return 'accessories';
  if (type === 'Винил') return 'vinyls';
  if (type === 'Номерная рамка') return 'frames';
  if (['Стандартные колеса', 'Спортивные колеса', 'Внедорожные колеса', 'Классические колеса', 'Американская классика', 'Советская классика', 'Японская классика'].includes(type)) return 'wheels';
  if (type === 'Еда') return 'food';
  if (type === 'Лекарство') return 'medicine';
  if (type === 'Оружие' || type === 'Фракционное оружие' || type === 'Фракционный аксессуар') return 'weapons';
  if (type === 'Фракционные патроны') return 'ammo';
  if (type === 'Расходный материал') return 'materials';
  if (type === 'Рабочий инструмент') return 'tools';
  if (type === 'Аудиокассета') return 'cassettes';
  if (type === 'Предмет в руки') {
    const drinkKeywords = ['вода', 'газиров', 'сок', 'квас', 'пиво', 'сидр', 'эль', 'вино', 'виски', 'ликер', 'абсент', 'молоко', 'чай', 'кофе', 'кола', 'лимонад', 'энергет'];
    if (drinkKeywords.some((k) => name.includes(k))) return 'drinks';
    return 'hand';
  }
  if (type === 'Рецепт') return 'recipes';
  if (type === 'Подарок') return 'gifts';
  if (type === 'Опыт') return 'exp';
  return 'other';
}
