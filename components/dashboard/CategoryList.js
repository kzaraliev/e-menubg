"use client";

export default function CategoryList({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onEditCategory, 
  onDeleteCategory, 
  isLoading 
}) {
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
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedCategory?._id === category._id
                    ? "border-primary bg-primary/10"
                    : "border-base-300 hover:border-primary/50 hover:bg-base-200"
                }`}
                onClick={() => onSelectCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {category.iconName && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-sm">
                          {getIconForName(category.iconName)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
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
                    Позиция: {category.position}
                  </span>
                  {!category.isActive && (
                    <span className="badge badge-warning badge-xs">Скрита</span>
                  )}
                </div>
              </div>
            ))}
          </div>
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