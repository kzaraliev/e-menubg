import connectMongo from "./mongoose";
import Translation from "@/models/Translation";

/**
 * Get a single translation for a specific entity field
 */
export const getTranslation = async (entityType, entityId, field, language, restaurantId) => {
  try {
    await connectMongo();
    
    const translation = await Translation.findOne({
      entityType,
      entityId,
      field,
      language,
      restaurantId,
      isActive: true
    });
    
    return translation?.translatedText || null;
  } catch (error) {
    console.error("Error getting translation:", error);
    return null;
  }
};

/**
 * Get all translations for a restaurant in a specific language
 */
export const getRestaurantTranslations = async (restaurantId, language) => {
  try {
    await connectMongo();
    
    const translations = await Translation.find({
      restaurantId,
      language,
      isActive: true
    });
    
    // Group translations by entity type and ID for easier lookup
    const translationMap = {};
    translations.forEach(translation => {
      const key = `${translation.entityType}_${translation.entityId}`;
      if (!translationMap[key]) {
        translationMap[key] = {};
      }
      translationMap[key][translation.field] = translation.translatedText;
    });
    
    return translationMap;
  } catch (error) {
    console.error("Error getting restaurant translations:", error);
    return {};
  }
};

/**
 * Apply translations to restaurant data
 */
export const applyTranslations = async (restaurant, categories, products, language = 'bg') => {
  // Validate inputs
  if (!restaurant || !categories || !products) {
    console.error("Invalid data passed to applyTranslations:", { restaurant: !!restaurant, categories: !!categories, products: !!products });
    return { restaurant: restaurant || {}, categories: categories || [], products: products || [] };
  }

  // If requesting default language, return original data
  if (language === restaurant.settings?.defaultLanguage || language === 'bg') {
    return { restaurant, categories, products };
  }
  
  try {
    const translationMap = await getRestaurantTranslations(restaurant._id, language);
    
    // Apply translations to restaurant
    const translatedRestaurant = { ...restaurant };
    const restaurantKey = `restaurant_${restaurant._id}`;
    if (translationMap[restaurantKey]) {
      const restaurantTranslations = translationMap[restaurantKey];
      if (restaurantTranslations.name) translatedRestaurant.name = restaurantTranslations.name;
      if (restaurantTranslations.description) translatedRestaurant.description = restaurantTranslations.description;
    }
    
    // Apply translations to categories
    const translatedCategories = categories.map(category => {
      const categoryKey = `category_${category._id}`;
      const translatedCategory = { ...category };
      
      if (translationMap[categoryKey]) {
        const categoryTranslations = translationMap[categoryKey];
        if (categoryTranslations.name) translatedCategory.name = categoryTranslations.name;
        if (categoryTranslations.description) translatedCategory.description = categoryTranslations.description;
      }
      
      return translatedCategory;
    });
    
    // Apply translations to products
    const translatedProducts = products.map(product => {
      const productKey = `menuProduct_${product._id}`;
      const translatedProduct = { ...product };
      
      if (translationMap[productKey]) {
        const productTranslations = translationMap[productKey];
        if (productTranslations.name) translatedProduct.name = productTranslations.name;
        if (productTranslations.description) translatedProduct.description = productTranslations.description;
        if (productTranslations.size) translatedProduct.size = productTranslations.size;
      }
      
      return translatedProduct;
    });
    
    return { 
      restaurant: translatedRestaurant, 
      categories: translatedCategories, 
      products: translatedProducts 
    };
  } catch (error) {
    console.error("Error applying translations:", error);
    // Return original data if translation fails
    return { restaurant, categories, products };
  }
};

/**
 * Get translation completion statistics for a restaurant
 */
export const getTranslationStats = async (restaurantId, language) => {
  try {
    await connectMongo();
    
    // This would need to be implemented based on your specific needs
    // Count total translatable fields vs translated fields
    const translations = await Translation.find({
      restaurantId,
      language,
      isActive: true
    });
    
    const stats = {
      totalTranslations: translations.length,
      restaurantTranslations: translations.filter(t => t.entityType === 'restaurant').length,
      categoryTranslations: translations.filter(t => t.entityType === 'category').length,
      productTranslations: translations.filter(t => t.entityType === 'menuProduct').length
    };
    
    return stats;
  } catch (error) {
    console.error("Error getting translation stats:", error);
    return { totalTranslations: 0, restaurantTranslations: 0, categoryTranslations: 0, productTranslations: 0 };
  }
};

/**
 * Create bulk translations (useful for auto-translation services)
 */
export const createBulkTranslations = async (restaurantId, targetLanguage, translationData) => {
  try {
    await connectMongo();
    
    const translations = [];
    
    for (const item of translationData) {
      const { entityType, entityId, field, translatedText } = item;
      
      // Check if translation already exists
      const existing = await Translation.findOne({
        entityType,
        entityId,
        field,
        language: targetLanguage,
        restaurantId
      });
      
      if (existing) {
        // Update existing
        existing.translatedText = translatedText;
        existing.isActive = true;
        await existing.save();
        translations.push(existing);
      } else {
        // Create new
        const translation = new Translation({
          entityType,
          entityId,
          field,
          language: targetLanguage,
          translatedText,
          restaurantId
        });
        await translation.save();
        translations.push(translation);
      }
    }
    
    return translations;
  } catch (error) {
    console.error("Error creating bulk translations:", error);
    throw error;
  }
};

/**
 * Validate language code
 */
export const isValidLanguageCode = (languageCode) => {
  return /^[a-z]{2}$/.test(languageCode);
};

/**
 * Get supported languages from config
 */
export const getSupportedLanguages = () => {
  // This would typically come from your config
  return [
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];
};