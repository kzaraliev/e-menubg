"use client";

import config from "@/config";

export default function ProductList({ 
  category, 
  products, 
  onEditProduct, 
  onDeleteProduct, 
  restaurantSettings,
  isLoading 
}) {
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
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">
            {category.name} Products
            <span className="badge badge-primary">{products.length}</span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No products in this category</h3>
            <p className="text-base-content/70 mb-4">
              Add your first product to {category.name}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border border-base-300 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-base-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.description && (
                          <p className="text-base-content/70 text-sm mt-1">
                            {product.description}
                          </p>
                        )}
                        
                        {/* Product badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.isPopular && (
                            <span className="badge badge-secondary badge-sm">Popular</span>
                          )}
                          {product.isVegetarian && (
                            <span className="badge badge-success badge-sm">Vegetarian</span>
                          )}
                          {product.isVegan && (
                            <span className="badge badge-success badge-sm">Vegan</span>
                          )}
                          {product.isSpicy && (
                            <span className="badge badge-warning badge-sm">Spicy 🌶️</span>
                          )}
                          {!product.isActive && (
                            <span className="badge badge-error badge-sm">Hidden</span>
                          )}
                          {!product.isAvailable && (
                            <span className="badge badge-neutral badge-sm">Out of Stock</span>
                          )}
                        </div>

                        {/* Additional info */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-base-content/60">
                          {product.size && (
                            <span>Size: {product.size}</span>
                          )}
                          {product.preparationTime && (
                            <span>~{product.preparationTime} min</span>
                          )}
                          {product.allergens && product.allergens.length > 0 && (
                            <span>Allergens: {product.allergens.join(', ')}</span>
                          )}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(product.priceBGN)}
                        </div>
                        
                        <div className="dropdown dropdown-end">
                          <button 
                            tabIndex={0} 
                            className="btn btn-ghost btn-sm mt-2"
                            disabled={isLoading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                            </svg>
                          </button>
                          <ul 
                            tabIndex={0} 
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <button
                                onClick={() => onEditProduct(product)}
                                disabled={isLoading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => onDeleteProduct(product._id)}
                                disabled={isLoading}
                                className="text-error"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}