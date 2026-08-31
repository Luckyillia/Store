export const ITEMS_PER_CARD = 24;
export const SKINS_PER_CARD = 6;
export const STORAGE_KEY = 'ph_sale_state_v2';

export const FILTER_CONFIG = [
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
  { key: 'recipes', label: 'Рецепты' },
  { key: 'gifts', label: 'Подарки' },
  { key: 'exp', label: 'Опыт' },
];

export const FILTER_DEFAULTS = {
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
};

export const CATEGORY_ORDER = [
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
];


export const SORT_OPTIONS = [
  { key: 'default', label: 'По умолчанию' },
  { key: 'name-asc', label: 'Имя (А → Я)' },
  { key: 'name-desc', label: 'Имя (Я → А)' },
  { key: 'weight-asc', label: 'Вес (лёгкие → тяжёлые)' },
  { key: 'weight-desc', label: 'Вес (тяжёлые → лёгкие)' },
  { key: 'price-asc', label: 'Цена (дешёвые → дорогие)' },
  { key: 'price-desc', label: 'Цена (дорогие → дешёвые)' },
];