"use client";

import { useState } from 'react';
import config from "@/config";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-hot-toast';

// Sortable Product Item Component
function SortableProduct({ product, onEditProduct, onDeleteProduct, restaurantSettings, isLoading, formatPrice }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 transition-all ${
        isDragging 
          ? "border-primary bg-primary/10 shadow-lg rotate-1 z-50" 
          : "border-base-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-4">
        <div 
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-base-300 transition-colors flex-shrink-0"
          title="Влачете за преподреждане"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
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
                  <span className="badge badge-secondary badge-sm">Популярно</span>
                )}
                {product.isVegetarian && (
                  <span className="badge badge-success badge-sm">Вегетарианско</span>
                )}
                {product.isVegan && (
                  <span className="badge badge-success badge-sm">Веганско</span>
                )}
                {product.isSpicy && (
                  <span className="badge badge-warning badge-sm">Остро 🌶️</span>
                )}
                {!product.isActive && (
                  <span className="badge badge-error badge-sm">Скрито</span>
                )}
                {!product.isAvailable && (
                  <span className="badge badge-neutral badge-sm">Няма на склад</span>
                )}
              </div>

              {/* Additional info */}
              <div className="flex items-center gap-4 mt-2 text-sm text-base-content/60">
                {product.size && (
                  <span>Размер: {product.size}</span>
                )}
                {product.preparationTime && (
                  <span>~{product.preparationTime} min</span>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <span>Алергени: {product.allergens.join(', ')}</span>
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
                      Редактирай
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
                      Изтрий
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductList({ 
  category, 
  products, 
  onEditProduct, 
  onDeleteProduct, 
  onReorderProducts,
  restaurantSettings,
  isLoading 
}) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = products.findIndex(item => item._id === active.id);
      const newIndex = products.findIndex(item => item._id === over.id);
      
      const items = arrayMove(products, oldIndex, newIndex);
      
      // Optimistically update UI
      onReorderProducts(items);

      // Update order on server
      try {
        const productIds = items.map(item => item._id);
        const response = await fetch('/api/products/sort', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryId: category._id,
            productIds
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update product order');
        }

        toast.success('Редът на продуктите е актуализиран');
      } catch (error) {
        console.error('Error updating product order:', error);
        toast.error('Грешка при актуализиране на реда');
        // Revert optimistic update on error
        onReorderProducts(products);
      }
    }
    
    setActiveId(null);
  };
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
            Продукти от {category.name}
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
            <h3 className="text-lg font-semibold mb-2">Няма продукти в тази категория</h3>
            <p className="text-base-content/70 mb-4">
              Добавете първия си продукт към {category.name}
            </p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={products.map(product => product._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {products.map((product) => (
                  <SortableProduct
                    key={product._id}
                    product={product}
                    onEditProduct={onEditProduct}
                    onDeleteProduct={onDeleteProduct}
                    restaurantSettings={restaurantSettings}
                    isLoading={isLoading}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="border border-primary bg-primary/10 shadow-lg rotate-1 opacity-95 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-xs">📋</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {products.find(product => product._id === activeId)?.name}
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {formatPrice(products.find(product => product._id === activeId)?.priceBGN || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}