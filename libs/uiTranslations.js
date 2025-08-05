// UI text translations for the public menu
export const uiTranslations = {
  bg: {
    // Restaurant header
    openToday: "Отворен днес",
    closedToday: "Затворен днес", 
    openHours: "Работно време",
    closed: "Затворен",
    
    // Menu navigation
    allCategories: "Всички категории",
    searchPlaceholder: "Търсене в менюто...",
    searchingFor: "Търсене за",
    clear: "Изчисти",
    noResults: "Няма намерени резултати",
    
    // Product details
    allergens: "Алергени",
    price: "Цена",
    size: "Размер",
    prepTime: "Време за приготвяне",
    minutes: "мин",
    
    // Product tags
    vegetarian: "Вегетариански",
    vegan: "Веган",
    spicy: "Лютo",
    popular: "Популярен",
    
    // Common allergens
    gluten: "Глутен",
    dairy: "Млечни продукти", 
    nuts: "Ядки",
    eggs: "Яйца",
    soy: "Соя",
    fish: "Риба",
    shellfish: "Миди и ракообразни",
    sesame: "Сусам",
    

    
    // Days of week
    monday: "Понеделник",
    tuesday: "Вторник", 
    wednesday: "Сряда",
    thursday: "Четвъртък",
    friday: "Петък",
    saturday: "Събота",
    sunday: "Неделя",
    
    // Language switcher
    availableLanguages: "Достъпно на множество езици",
    language: "Език"
  },
  
  en: {
    // Restaurant header
    openToday: "Open Today",
    closedToday: "Closed Today",
    openHours: "Opening Hours", 
    closed: "Closed",
    
    // Menu navigation
    allCategories: "All Categories",
    searchPlaceholder: "Search menu...",
    searchingFor: "Searching for",
    clear: "Clear",
    noResults: "No results found",
    
    // Product details
    allergens: "Allergens",
    price: "Price", 
    size: "Size",
    prepTime: "Prep Time",
    minutes: "min",
    
    // Product tags
    vegetarian: "Vegetarian",
    vegan: "Vegan", 
    spicy: "Spicy",
    popular: "Popular",
    
    // Common allergens
    gluten: "Gluten",
    dairy: "Dairy",
    nuts: "Nuts", 
    eggs: "Eggs",
    soy: "Soy",
    fish: "Fish",
    shellfish: "Shellfish", 
    sesame: "Sesame",
    

    
    // Days of week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday", 
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    
    // Language switcher
    availableLanguages: "Available in multiple languages",
    language: "Language"
  },
  
  de: {
    // Restaurant header
    openToday: "Heute geöffnet",
    closedToday: "Heute geschlossen",
    openHours: "Öffnungszeiten",
    closed: "Geschlossen",
    
        // Menu navigation
    allCategories: "Alle Kategorien",
    searchPlaceholder: "Menü durchsuchen...",
    searchingFor: "Suche nach",
    clear: "Löschen",
    noResults: "Keine Ergebnisse gefunden",
    
    // Product details
    allergens: "Allergene",
    price: "Preis",
    size: "Größe", 
    prepTime: "Zubereitungszeit",
    minutes: "Min",
    
    // Product tags
    vegetarian: "Vegetarisch",
    vegan: "Vegan",
    spicy: "Scharf",
    popular: "Beliebt",
    
    // Common allergens
    gluten: "Gluten",
    dairy: "Milchprodukte",
    nuts: "Nüsse",
    eggs: "Eier",
    soy: "Soja", 
    fish: "Fisch",
    shellfish: "Schalentiere",
    sesame: "Sesam",
    

    
    // Days of week
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
    
    // Language switcher
    availableLanguages: "In mehreren Sprachen verfügbar",
    language: "Sprache"
  },
  
  ru: {
    // Restaurant header
    openToday: "Открыто сегодня",
    closedToday: "Закрыто сегодня", 
    openHours: "Часы работы",
    closed: "Закрыто",
    
    // Menu navigation
    allCategories: "Все категории",
    searchPlaceholder: "Поиск по меню...",
    searchingFor: "Поиск по",
    clear: "Очистить",
    noResults: "Результаты не найдены",
    
    // Product details
    allergens: "Аллергены",
    price: "Цена",
    size: "Размер",
    prepTime: "Время приготовления", 
    minutes: "мин",
    
    // Product tags
    vegetarian: "Вегетарианское",
    vegan: "Веганское",
    spicy: "Острое",
    popular: "Популярное",
    
    // Common allergens
    gluten: "Глютен",
    dairy: "Молочные продукты",
    nuts: "Орехи",
    eggs: "Яйца",
    soy: "Соя",
    fish: "Рыба",
    shellfish: "Моллюски",
    sesame: "Кунжут",
    

    
    // Days of week
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота", 
    sunday: "Воскресенье",
    
    // Language switcher
    availableLanguages: "Доступно на нескольких языках",
    language: "Язык"
  }
};

// Helper function to get translated text
export const getUIText = (key, language = 'bg') => {
  return uiTranslations[language]?.[key] || uiTranslations['bg'][key] || key;
};

// Helper function to translate allergen
export const translateAllergen = (allergen, language = 'bg') => {
  const allergenKey = allergen.toLowerCase().replace(/\s+/g, '');
  return getUIText(allergenKey, language);
};



// Helper function to translate day of week
export const translateDay = (day, language = 'bg') => {
  return getUIText(day.toLowerCase(), language);
};