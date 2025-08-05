"use client";

import { useState, useEffect } from "react";
import RestaurantHeader from "./RestaurantHeader";
import CategorySection from "./CategorySection";
import MenuNavigation from "./MenuNavigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { getUIText } from "@/libs/uiTranslations";

import config from "@/config";

export default function PublicMenu({ menuData }) {
  const { restaurant: initialRestaurant, categories: initialCategories, availableLanguages } = menuData;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("bg");
  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [categories, setCategories] = useState(initialCategories);
  const [isTranslating, setIsTranslating] = useState(false);

  // Function to switch language
  const handleLanguageChange = async (languageCode) => {
    if (languageCode === currentLanguage) return;
    
    setIsTranslating(true);
    
    try {
      if (languageCode === 'bg') {
        // Reset to original data for Bulgarian
        setRestaurant(initialRestaurant);
        setCategories(initialCategories);
        setCurrentLanguage('bg');
      } else {
        // Fetch translations for the selected language
        const response = await fetch(`/api/translations?restaurantId=${initialRestaurant._id}&language=${languageCode}`);
        
        if (response.ok) {
          const translations = await response.json();
          
          // Apply translations to the data
          const translatedData = applyTranslationsToData(
            initialRestaurant, 
            initialCategories, 
            translations
          );
          
          setRestaurant(translatedData.restaurant);
          setCategories(translatedData.categories);
          setCurrentLanguage(languageCode);
        } else {
          console.error('Failed to fetch translations');
          // Keep current data if translation fails
        }
      }
    } catch (error) {
      console.error('Error switching language:', error);
      // Keep current data if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  // Function to apply translations to data
  const applyTranslationsToData = (restaurant, categories, translations) => {
    // Create translation lookup map
    const translationMap = {};
    translations.forEach(translation => {
      const key = `${translation.entityType}_${translation.entityId}_${translation.field}`;
      translationMap[key] = translation.translatedText;
    });

    // Apply translations to restaurant
    const translatedRestaurant = { ...restaurant };
    const restaurantNameKey = `restaurant_${restaurant._id}_name`;
    const restaurantDescKey = `restaurant_${restaurant._id}_description`;
    
    if (translationMap[restaurantNameKey]) {
      translatedRestaurant.name = translationMap[restaurantNameKey];
    }
    if (translationMap[restaurantDescKey]) {
      translatedRestaurant.description = translationMap[restaurantDescKey];
    }

    // Apply translations to categories
    const translatedCategories = categories.map(category => {
      const translatedCategory = { ...category };
      const categoryNameKey = `category_${category._id}_name`;
      const categoryDescKey = `category_${category._id}_description`;
      
      if (translationMap[categoryNameKey]) {
        translatedCategory.name = translationMap[categoryNameKey];
      }
      if (translationMap[categoryDescKey]) {
        translatedCategory.description = translationMap[categoryDescKey];
      }

      // Apply translations to products
      const translatedProducts = category.products.map(product => {
        const translatedProduct = { ...product };
        const productNameKey = `menuProduct_${product._id}_name`;
        const productDescKey = `menuProduct_${product._id}_description`;
        const productSizeKey = `menuProduct_${product._id}_size`;
        
        if (translationMap[productNameKey]) {
          translatedProduct.name = translationMap[productNameKey];
        }
        if (translationMap[productDescKey]) {
          translatedProduct.description = translationMap[productDescKey];
        }
        if (translationMap[productSizeKey]) {
          translatedProduct.size = translationMap[productSizeKey];
        }
        
        return translatedProduct;
      });

      return { ...translatedCategory, products: translatedProducts };
    });

    return { restaurant: translatedRestaurant, categories: translatedCategories };
  };

  // Filter categories and products based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    products: category.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    // Show category if it has products or if we're not searching
    category.products.length > 0 || searchQuery === ""
  );

  // Get products for selected category or all if none selected
  const displayCategories = selectedCategory
    ? filteredCategories.filter(cat => cat._id === selectedCategory)
    : filteredCategories;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Restaurant Header */}
      <RestaurantHeader restaurant={restaurant} currentLanguage={currentLanguage} />
      
      {/* Navigation */}
      <MenuNavigation 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentLanguage={currentLanguage}
      />
      
      {/* Language Switcher */}
      {availableLanguages && availableLanguages.length > 1 && (
        <LanguageSwitcher 
          currentLanguage={currentLanguage}
          availableLanguages={availableLanguages}
          onLanguageChange={handleLanguageChange}
          isTranslating={isTranslating}
        />
      )}

      {/* Menu Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-base-content/80">
                {getUIText('searchingFor', currentLanguage)}: "<span className="text-primary font-normal">{searchQuery}</span>"
              </h2>
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content"
              >
                {getUIText('clear', currentLanguage)}
              </button>
            </div>
            {filteredCategories.reduce((total, cat) => total + cat.products.length, 0) === 0 && (
              <p className="text-base-content/60 mt-3 text-sm">{getUIText('noResults', currentLanguage)}</p>
            )}
          </div>
        )}

        {displayCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Menu Coming Soon</h3>
            <p className="text-base-content/70">
              We're working on adding our delicious menu items. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {displayCategories.map((category) => (
              <CategorySection 
                key={category._id}
                category={category}
                restaurantSettings={restaurant.settings}
                currentLanguage={currentLanguage}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-base-200 border-t border-base-300 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{restaurant.name}</h3>
              {restaurant.description && (
                <p className="text-base-content/70 mb-4">{restaurant.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="badge badge-primary">{restaurant.priceRange}</span>
              </div>
            </div>

            {/* Contact Info */}
            {(restaurant.address || restaurant.phone || restaurant.email) && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <div className="space-y-2 text-sm">
                  {restaurant.address && (
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{restaurant.address}</span>
                    </div>
                  )}
                  {restaurant.phone && (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${restaurant.phone}`} className="link link-primary">
                        {restaurant.phone}
                      </a>
                    </div>
                  )}
                  {restaurant.email && (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${restaurant.email}`} className="link link-primary">
                        {restaurant.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Powered by */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Powered by</h3>
              <a 
                href="/" 
                className="text-primary font-semibold hover:underline"
              >
                {config.appName}
              </a>
              <p className="text-xs text-base-content/50 mt-2">
                Digital menu platform for restaurants
              </p>
            </div>
          </div>
          
          <div className="border-t border-base-300 mt-8 pt-8 text-center text-sm text-base-content/70">
            <p>&copy; {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}