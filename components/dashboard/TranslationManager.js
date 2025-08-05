"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import config from "@/config";
import TranslationGrid from "./TranslationGrid";
import LanguageSelector from "./LanguageSelector";

export default function TranslationManager({ data }) {
  const { restaurant, categories, products, translations } = data;
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English
  const [availableLanguages, setAvailableLanguages] = useState(
    restaurant.settings?.availableLanguages || ["bg"]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [translationsMap, setTranslationsMap] = useState({});

  // Build translations map for quick lookup
  useEffect(() => {
    const map = {};
    translations.forEach(translation => {
      const key = `${translation.entityType}_${translation.entityId}_${translation.field}_${translation.language}`;
      map[key] = translation;
    });
    setTranslationsMap(map);
  }, [translations]);

  // Get translation for a specific field
  const getTranslation = (entityType, entityId, field, language) => {
    const key = `${entityType}_${entityId}_${field}_${language}`;
    return translationsMap[key]?.translatedText || "";
  };

  // Save translation
  const handleSaveTranslation = async (entityType, entityId, field, language, translatedText) => {
    if (!translatedText.trim()) {
      toast.error("Translation text cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType,
          entityId,
          field,
          language,
          translatedText: translatedText.trim(),
          restaurantId: restaurant._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save translation");
      }

      const savedTranslation = await response.json();
      
      // Update local translations map
      const key = `${entityType}_${entityId}_${field}_${language}`;
      setTranslationsMap(prev => ({
        ...prev,
        [key]: savedTranslation
      }));

      toast.success("Translation saved successfully!");
    } catch (error) {
      console.error("Error saving translation:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete translation
  const handleDeleteTranslation = async (translationId, entityType, entityId, field, language) => {
    if (!confirm("Are you sure you want to delete this translation?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/translations/${translationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete translation");
      }

      // Remove from local translations map
      const key = `${entityType}_${entityId}_${field}_${language}`;
      setTranslationsMap(prev => {
        const newMap = { ...prev };
        delete newMap[key];
        return newMap;
      });

      toast.success("Translation deleted successfully!");
    } catch (error) {
      console.error("Error deleting translation:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new language
  const handleAddLanguage = async (languageCode) => {
    if (availableLanguages.includes(languageCode)) {
      toast.error("Language already added");
      return;
    }

    setIsLoading(true);
    try {
      // Update restaurant settings
      const response = await fetch("/api/restaurant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            ...restaurant.settings,
            availableLanguages: [...availableLanguages, languageCode]
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add language");
      }

      setAvailableLanguages(prev => [...prev, languageCode]);
      toast.success("Language added successfully!");
    } catch (error) {
      console.error("Error adding language:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove language
  const handleRemoveLanguage = async (languageCode) => {
    if (languageCode === restaurant.settings?.defaultLanguage || languageCode === "bg") {
      toast.error("Cannot remove default language");
      return;
    }

    if (!confirm(`Are you sure you want to remove ${languageCode}? All translations for this language will be deleted.`)) {
      return;
    }

    setIsLoading(true);
    try {
      // Update restaurant settings
      const newAvailableLanguages = availableLanguages.filter(lang => lang !== languageCode);
      
      const response = await fetch("/api/restaurant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            ...restaurant.settings,
            availableLanguages: newAvailableLanguages
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove language");
      }

      // Remove translations for this language from local state
      setTranslationsMap(prev => {
        const newMap = {};
        Object.keys(prev).forEach(key => {
          if (!key.endsWith(`_${languageCode}`)) {
            newMap[key] = prev[key];
          }
        });
        return newMap;
      });

      setAvailableLanguages(newAvailableLanguages);
      
      // Switch to default language if current language was removed
      if (selectedLanguage === languageCode) {
        setSelectedLanguage(restaurant.settings?.defaultLanguage || "bg");
      }

      toast.success("Language removed successfully!");
    } catch (error) {
      console.error("Error removing language:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate translation stats
  const getTranslationStats = (language) => {
    const totalFields = getTotalTranslatableFields();
    const translatedFields = getTranslatedFields(language);
    const percentage = totalFields > 0 ? Math.round((translatedFields / totalFields) * 100) : 0;
    
    return {
      total: totalFields,
      translated: translatedFields,
      percentage,
      remaining: totalFields - translatedFields
    };
  };

  const getTotalTranslatableFields = () => {
    let total = 2; // Restaurant name and description
    total += categories.length * 2; // Category name and description
    total += products.length * 3; // Product name, description, and size
    return total;
  };

  const getTranslatedFields = (language) => {
    let translated = 0;
    
    // Restaurant translations
    if (getTranslation("restaurant", restaurant._id, "name", language)) translated++;
    if (getTranslation("restaurant", restaurant._id, "description", language)) translated++;
    
    // Category translations
    categories.forEach(category => {
      if (getTranslation("category", category._id, "name", language)) translated++;
      if (getTranslation("category", category._id, "description", language)) translated++;
    });
    
    // Product translations
    products.forEach(product => {
      if (getTranslation("menuProduct", product._id, "name", language)) translated++;
      if (getTranslation("menuProduct", product._id, "description", language)) translated++;
      if (getTranslation("menuProduct", product._id, "size", language)) translated++;
    });
    
    return translated;
  };

  const currentStats = getTranslationStats(selectedLanguage);

  return (
    <div className="space-y-6">
      {/* Language Management */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Language Management</h2>
          
          <LanguageSelector
            availableLanguages={availableLanguages}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
            onAddLanguage={handleAddLanguage}
            onRemoveLanguage={handleRemoveLanguage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Translation Progress */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Translation Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat">
              <div className="stat-title">Completion</div>
              <div className="stat-value text-primary text-2xl">{currentStats.percentage}%</div>
              <div className="stat-desc">{currentStats.translated} of {currentStats.total} fields</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Remaining</div>
              <div className="stat-value text-2xl">{currentStats.remaining}</div>
              <div className="stat-desc">fields to translate</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Language</div>
              <div className="stat-value text-lg">
                {config.menu.supportedLanguages.find(l => l.code === selectedLanguage)?.name || selectedLanguage}
              </div>
              <div className="stat-desc">
                {config.menu.supportedLanguages.find(l => l.code === selectedLanguage)?.flag}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Progress</div>
              <div className="stat-value">
                <progress 
                  className="progress progress-primary w-full" 
                  value={currentStats.percentage} 
                  max="100"
                ></progress>
              </div>
              <div className="stat-desc">{currentStats.percentage}% complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Translation Grid */}
      <TranslationGrid
        restaurant={restaurant}
        categories={categories}
        products={products}
        selectedLanguage={selectedLanguage}
        getTranslation={getTranslation}
        onSaveTranslation={handleSaveTranslation}
        onDeleteTranslation={handleDeleteTranslation}
        translationsMap={translationsMap}
        isLoading={isLoading}
      />
    </div>
  );
}