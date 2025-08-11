"use client";

import { useState } from 'react';
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
import Image from 'next/image';

// Sortable Category Item Component
function SortableCategory({ category, selectedCategory, onSelectCategory, onEditCategory, onDeleteCategory, isLoading, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg border transition-all ${
        isDragging 
          ? "border-primary bg-primary/10 shadow-lg rotate-2 z-50" 
          : selectedCategory?._id === category._id
            ? "border-primary bg-primary/10"
            : "border-base-300 hover:border-primary/50 hover:bg-base-200"
      }`}
      onClick={() => !isDragging && onSelectCategory(category)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-base-300 transition-colors"
            title="Влачете за преподреждане"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          
          {/* Category Image or Icon */}
          <div className="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : category.iconName ? (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">
                  {getIconForName(category.iconName)}
                </span>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-base-content/70 truncate">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="dropdown dropdown-end">
          <button 
            tabIndex={0} 
            className="btn btn-ghost btn-sm"
            onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(category);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category._id);
                }}
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
      
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-base-content/50">
          Позиция: {index + 1}
        </span>
        {!category.isActive && (
          <span className="badge badge-warning badge-xs">Скрита</span>
        )}
      </div>
    </div>
  );
}

export default function CategoryList({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onEditCategory, 
  onDeleteCategory, 
  onReorderCategories,
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
      const oldIndex = categories.findIndex(item => item._id === active.id);
      const newIndex = categories.findIndex(item => item._id === over.id);
      
      const items = arrayMove(categories, oldIndex, newIndex);
      
      // Optimistically update UI
      onReorderCategories(items);

      // Update order on server
      try {
        const categoryIds = items.map(item => item._id);
        const response = await fetch('/api/categories/sort', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId: categories[0]?.restaurantId,
            categoryIds
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update category order');
        }

        toast.success('Редът на категориите е актуализиран');
      } catch (error) {
        console.error('Error updating category order:', error);
        toast.error('Грешка при актуализиране на реда');
        // Revert optimistic update on error
        onReorderCategories(categories);
      }
    }
    
    setActiveId(null);
  };
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Категории</h2>
        
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content/70">Все още няма категории</p>
            <p className="text-sm text-base-content/50">Създайте първата си категория, за да започнете</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={categories.map(cat => cat._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <SortableCategory
                    key={category._id}
                    category={category}
                    selectedCategory={selectedCategory}
                    onSelectCategory={onSelectCategory}
                    onEditCategory={onEditCategory}
                    onDeleteCategory={onDeleteCategory}
                    isLoading={isLoading}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="p-3 rounded-lg border border-primary bg-primary/10 shadow-lg rotate-2 opacity-95">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const category = categories.find(cat => cat._id === activeId);
                      return (
                        <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {category?.imageUrl ? (
                            <Image 
                              src={category.imageUrl} 
                              alt={category.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : category?.iconName ? (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary text-xs">
                                {getIconForName(category.iconName)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-primary text-xs">📋</span>
                          )}
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="font-medium">
                        {categories.find(cat => cat._id === activeId)?.name}
                      </h3>
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
    'beer': '🍺',
    'default': '📋'
  };
  
  return icons[iconName] || icons.default;
}