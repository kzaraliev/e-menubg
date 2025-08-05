"use client";

import { useState } from "react";
import TranslationField from "./TranslationField";
import config from "@/config";

export default function TranslationGrid({ 
  restaurant, 
  categories, 
  products, 
  selectedLanguage, 
  getTranslation, 
  onSaveTranslation, 
  onDeleteTranslation, 
  translationsMap,
  isLoading 
}) {
  const [expandedSections, setExpandedSections] = useState({
    restaurant: true,
    categories: true,
    products: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get translation ID for deletion
  const getTranslationId = (entityType, entityId, field, language) => {
    const key = `${entityType}_${entityId}_${field}_${language}`;
    return translationsMap[key]?._id;
  };

  // Group products by category for better organization
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(product => product.categoryId === category._id)
  }));

  return (
    <div className="space-y-6">
      {/* Restaurant Information */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">
              🏪 Restaurant Information
            </h2>
            <button
              onClick={() => toggleSection('restaurant')}
              className="btn btn-ghost btn-sm"
            >
              {expandedSections.restaurant ? '−' : '+'}
            </button>
          </div>
          
          {expandedSections.restaurant && (
            <div className="space-y-4 mt-4">
              <TranslationField
                label="Restaurant Name"
                originalText={restaurant.name}
                translatedText={getTranslation("restaurant", restaurant._id, "name", selectedLanguage)}
                onSave={(text) => onSaveTranslation("restaurant", restaurant._id, "name", selectedLanguage, text)}
                onDelete={() => {
                  const translationId = getTranslationId("restaurant", restaurant._id, "name", selectedLanguage);
                  if (translationId) {
                    onDeleteTranslation(translationId, "restaurant", restaurant._id, "name", selectedLanguage);
                  }
                }}
                hasTranslation={!!getTranslation("restaurant", restaurant._id, "name", selectedLanguage)}
                isLoading={isLoading}
              />
              
              {restaurant.description && (
                <TranslationField
                  label="Restaurant Description"
                  originalText={restaurant.description}
                  translatedText={getTranslation("restaurant", restaurant._id, "description", selectedLanguage)}
                  onSave={(text) => onSaveTranslation("restaurant", restaurant._id, "description", selectedLanguage, text)}
                  onDelete={() => {
                    const translationId = getTranslationId("restaurant", restaurant._id, "description", selectedLanguage);
                    if (translationId) {
                      onDeleteTranslation(translationId, "restaurant", restaurant._id, "description", selectedLanguage);
                    }
                  }}
                  hasTranslation={!!getTranslation("restaurant", restaurant._id, "description", selectedLanguage)}
                  isLoading={isLoading}
                  isTextarea={true}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">
                📁 Categories ({categories.length})
              </h2>
              <button
                onClick={() => toggleSection('categories')}
                className="btn btn-ghost btn-sm"
              >
                {expandedSections.categories ? '−' : '+'}
              </button>
            </div>
            
            {expandedSections.categories && (
              <div className="space-y-6 mt-4">
                {categories.map(category => (
                  <div key={category._id} className="border border-base-300 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      {category.iconName && (
                        <span className="text-xl">
                          {getIconForName(category.iconName)}
                        </span>
                      )}
                      {category.name}
                    </h3>
                    
                    <div className="space-y-4">
                      <TranslationField
                        label="Category Name"
                        originalText={category.name}
                        translatedText={getTranslation("category", category._id, "name", selectedLanguage)}
                        onSave={(text) => onSaveTranslation("category", category._id, "name", selectedLanguage, text)}
                        onDelete={() => {
                          const translationId = getTranslationId("category", category._id, "name", selectedLanguage);
                          if (translationId) {
                            onDeleteTranslation(translationId, "category", category._id, "name", selectedLanguage);
                          }
                        }}
                        hasTranslation={!!getTranslation("category", category._id, "name", selectedLanguage)}
                        isLoading={isLoading}
                      />
                      
                      {category.description && (
                        <TranslationField
                          label="Category Description"
                          originalText={category.description}
                          translatedText={getTranslation("category", category._id, "description", selectedLanguage)}
                          onSave={(text) => onSaveTranslation("category", category._id, "description", selectedLanguage, text)}
                          onDelete={() => {
                            const translationId = getTranslationId("category", category._id, "description", selectedLanguage);
                            if (translationId) {
                              onDeleteTranslation(translationId, "category", category._id, "description", selectedLanguage);
                            }
                          }}
                          hasTranslation={!!getTranslation("category", category._id, "description", selectedLanguage)}
                          isLoading={isLoading}
                          isTextarea={true}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">
                🍽️ Menu Products ({products.length})
              </h2>
              <button
                onClick={() => toggleSection('products')}
                className="btn btn-ghost btn-sm"
              >
                {expandedSections.products ? '−' : '+'}
              </button>
            </div>
            
            {expandedSections.products && (
              <div className="space-y-8 mt-4">
                {productsByCategory.map(({ category, products: categoryProducts }) => (
                  <div key={category._id}>
                    <h3 className="font-semibold text-lg mb-4 text-primary">
                      {category.name} ({categoryProducts.length} products)
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {categoryProducts.map(product => (
                        <div key={product._id} className="border border-base-300 rounded-lg p-4">
                          <h4 className="font-medium mb-4 flex items-center justify-between">
                            <span>{product.name}</span>
                            <span className="text-primary font-bold">
                              {product.priceBGN.toFixed(2)} лв
                            </span>
                          </h4>
                          
                          <div className="space-y-4">
                            <TranslationField
                              label="Product Name"
                              originalText={product.name}
                              translatedText={getTranslation("menuProduct", product._id, "name", selectedLanguage)}
                              onSave={(text) => onSaveTranslation("menuProduct", product._id, "name", selectedLanguage, text)}
                              onDelete={() => {
                                const translationId = getTranslationId("menuProduct", product._id, "name", selectedLanguage);
                                if (translationId) {
                                  onDeleteTranslation(translationId, "menuProduct", product._id, "name", selectedLanguage);
                                }
                              }}
                              hasTranslation={!!getTranslation("menuProduct", product._id, "name", selectedLanguage)}
                              isLoading={isLoading}
                            />
                            
                            {product.description && (
                              <TranslationField
                                label="Product Description"
                                originalText={product.description}
                                translatedText={getTranslation("menuProduct", product._id, "description", selectedLanguage)}
                                onSave={(text) => onSaveTranslation("menuProduct", product._id, "description", selectedLanguage, text)}
                                onDelete={() => {
                                  const translationId = getTranslationId("menuProduct", product._id, "description", selectedLanguage);
                                  if (translationId) {
                                    onDeleteTranslation(translationId, "menuProduct", product._id, "description", selectedLanguage);
                                  }
                                }}
                                hasTranslation={!!getTranslation("menuProduct", product._id, "description", selectedLanguage)}
                                isLoading={isLoading}
                                isTextarea={true}
                              />
                            )}
                            
                            {product.size && (
                              <TranslationField
                                label="Size/Portion"
                                originalText={product.size}
                                translatedText={getTranslation("menuProduct", product._id, "size", selectedLanguage)}
                                onSave={(text) => onSaveTranslation("menuProduct", product._id, "size", selectedLanguage, text)}
                                onDelete={() => {
                                  const translationId = getTranslationId("menuProduct", product._id, "size", selectedLanguage);
                                  if (translationId) {
                                    onDeleteTranslation(translationId, "menuProduct", product._id, "size", selectedLanguage);
                                  }
                                }}
                                hasTranslation={!!getTranslation("menuProduct", product._id, "size", selectedLanguage)}
                                isLoading={isLoading}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 && products.length === 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <h3 className="text-xl font-semibold mb-2">No Menu Content Yet</h3>
            <p className="text-base-content/70 mb-4">
              Create categories and menu items first before adding translations.
            </p>
            <a href="/dashboard/menu" className="btn btn-primary">
              Manage Menu
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get icon for category
function getIconForName(iconName) {
  return config.menu.categoryIcons[iconName] || '📋';
}