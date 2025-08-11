"use client";

import config from "@/config";
import { getUIText, translateAllergen } from "@/libs/uiTranslations";
import Image from "next/image";

export default function ProductCard({ product, restaurantSettings, currentLanguage = 'bg' }) {
  const formatPrice = (priceBGN) => {
    const priceEUR = (priceBGN / config.menu.bgnToEurRate).toFixed(2);
    const parts = [];
    
    if (restaurantSettings?.showPricesInBGN) {
      parts.push(`${priceBGN.toFixed(2)} лв`);
    }
    
    if (restaurantSettings?.showPricesInEuro) {
      parts.push(`€${priceEUR}`);
    }
    
    return parts.join(' / ') || `${priceBGN.toFixed(2)} лв`;
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      {product.imageUrl ? (
        <figure className="h-48 overflow-hidden">
          <Image 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </figure>
      ) : (
        <figure className="h-48 bg-base-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </figure>
      )}

      <div className="card-body p-6">
        {/* Product Name and Badges */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="card-title text-lg">{product.name}</h3>
          
          {/* Status badges */}
          <div className="flex gap-1">
            {product.isPopular && (
              <span className="badge badge-secondary badge-sm">
                {getUIText('popular', currentLanguage)}
              </span>
            )}
            {!product.isAvailable && (
              <span className="badge badge-error badge-sm">Out</span>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-base-content/70 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Product Details */}
        <div className="space-y-2 mb-4">
          {/* Size */}
          {product.size && (
            <div className="text-sm text-base-content/60">
              <span className="font-medium">{getUIText('size', currentLanguage)}:</span> {product.size}
            </div>
          )}

          {/* Preparation Time */}
          {product.preparationTime && (
            <div className="text-sm text-base-content/60">
              <span className="font-medium">{getUIText('prepTime', currentLanguage)}:</span> ~{product.preparationTime} {getUIText('minutes', currentLanguage)}
            </div>
          )}

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="text-sm text-base-content/60">
              <span className="font-medium">{getUIText('allergens', currentLanguage)}:</span> {product.allergens.map(allergen => translateAllergen(allergen, currentLanguage)).join(', ')}
            </div>
          )}
        </div>

        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.isVegetarian && (
            <span className="badge badge-success badge-outline badge-sm">
              🌱 {getUIText('vegetarian', currentLanguage)}
            </span>
          )}
          {product.isVegan && (
            <span className="badge badge-success badge-outline badge-sm">
              🌿 {getUIText('vegan', currentLanguage)}
            </span>
          )}
          {product.isSpicy && (
            <span className="badge badge-warning badge-outline badge-sm">
              🌶️ {getUIText('spicy', currentLanguage)}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="card-actions justify-between items-center">
          <div className="text-xl font-bold text-primary">
            {formatPrice(product.priceBGN)}
          </div>
          
          {/* Availability Status */}
          {!product.isAvailable && (
            <span className="text-error text-sm font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}