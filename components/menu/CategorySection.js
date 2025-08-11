"use client";

import ProductCard from "./ProductCard";
import config from "@/config";
import Image from "next/image";

export default function CategorySection({ category, restaurantSettings, currentLanguage = 'bg' }) {
  if (!category.products || category.products.length === 0) {
    return null;
  }

  // Get icon for category
  const getIconForName = (iconName) => {
    return config.menu.categoryIcons[iconName] || '📋';
  };

  return (
    <section id={`category-${category._id}`} className="scroll-mt-24">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {category.iconName && (
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">
                {getIconForName(category.iconName)}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-base-content">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-base-content/70 mt-1">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Category Image */}
        {category.imageUrl && (
          <div className="w-full h-48 lg:h-64 rounded-xl overflow-hidden shadow-lg mb-6">
            <Image 
              src={category.imageUrl} 
              alt={category.name}
              width={800}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.products.map((product) => (
          <ProductCard 
            key={product._id}
            product={product}
            restaurantSettings={restaurantSettings}
            currentLanguage={currentLanguage}
          />
        ))}
      </div>
    </section>
  );
}