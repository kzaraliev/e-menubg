"use client";

import { getUIText } from "@/libs/uiTranslations";

export default function MenuNavigation({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  searchQuery, 
  onSearchChange,
  currentLanguage = 'bg'
}) {
  return (
    <nav className="sticky top-0 bg-base-100 border-b border-base-300 z-40 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Search Section - Mobile */}
          <div className="py-3 border-b border-base-300/50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={getUIText('searchPlaceholder', currentLanguage)}
                className="input input-bordered input-sm w-full pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40 hover:text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Categories Section - Mobile */}
          <div className="py-3">
            <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <button
                onClick={() => onSelectCategory(null)}
                className={`btn btn-sm ${
                  !selectedCategory 
                    ? 'btn-primary' 
                    : 'btn-ghost'
                } whitespace-nowrap flex-shrink-0`}
              >
                {getUIText('allCategories', currentLanguage)}
              </button>
              
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => onSelectCategory(category._id)}
                  className={`btn btn-sm ${
                    selectedCategory === category._id 
                      ? 'btn-primary' 
                      : 'btn-ghost'
                  } whitespace-nowrap flex-shrink-0`}
                >
                  <span className="mr-2">{getIconForName(category.iconName)}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between py-4">
          {/* Category Navigation - Desktop */}
          <div className="flex items-center gap-3 flex-1 overflow-x-auto scroll-smooth" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <button
              onClick={() => onSelectCategory(null)}
              className={`btn btn-sm ${
                !selectedCategory 
                  ? 'btn-primary' 
                  : 'btn-ghost'
              } whitespace-nowrap flex-shrink-0`}
            >
              {getUIText('allCategories', currentLanguage)}
            </button>
            
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onSelectCategory(category._id)}
                className={`btn btn-sm ${
                  selectedCategory === category._id 
                    ? 'btn-primary' 
                    : 'btn-ghost'
                } whitespace-nowrap flex-shrink-0`}
              >
                <span className="mr-2">{getIconForName(category.iconName)}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Search - Desktop */}
          <div className="flex items-center gap-2 ml-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={getUIText('searchPlaceholder', currentLanguage)}
                className="input input-bordered input-sm w-64 pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40 hover:text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>


      </div>
    </nav>
  );
}

// Helper function to get icon for category
function getIconForName(iconName) {
  const icons = {
    'utensils': '🍽️',
    'coffee': '☕',
    'pizza': '🍕',
    'wine': '🍷',
    'dessert': '🍰',
    'salad': '🥗',
    'burger': '🍔',
    'pasta': '🍝',
    'fish': '🐟',
    'meat': '🥩',
    'vegetarian': '🥬',
    'soup': '🍲',
    'bread': '🍞',
    'breakfast': '🍳',
    'cocktail': '🍸',
    'beer': '🍺'
  };
  
  return icons[iconName] || '';
}