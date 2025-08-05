"use client";

import { useState, useEffect } from "react";

export default function CategoryForm({ category, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconName: "",
    imageUrl: "",
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        iconName: category.iconName || "",
        imageUrl: category.imageUrl || "",
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    }
  }, [category]);

  const iconOptions = [
    { value: "", label: "Без икона" },
    { value: "utensils", label: "🍽️ Общо" },
    { value: "coffee", label: "☕ Кафе и напитки" },
    { value: "pizza", label: "🍕 Пица" },
    { value: "wine", label: "🍷 Вино и алкохол" },
    { value: "dessert", label: "🍰 Десерти" },
    { value: "salad", label: "🥗 Салати" },
    { value: "burger", label: "🍔 Хамбургери" },
    { value: "pasta", label: "🍝 Паста" },
    { value: "fish", label: "🐟 Морски дарове" },
    { value: "meat", label: "🥩 Месо" },
    { value: "vegetarian", label: "🥬 Вегетарианско" },
    { value: "soup", label: "🍲 Супи" },
    { value: "bread", label: "🍞 Пекарни изделия" },
    { value: "breakfast", label: "🍳 Закуска" },
    { value: "cocktail", label: "🍸 Коктейли" },
    { value: "beer", label: "🍺 Бира" }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Името на категорията е задължително";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Debug logging
    console.log("Form data being submitted:", formData);
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-base-100 p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {category ? "Редактирай категория" : "Създай категория"}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-ghost btn-sm"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Име на категория *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                  placeholder="напр. Предястия, Основни ястия, Напитки"
                  required
                />
                {errors.name && <span className="text-error text-sm mt-1">{errors.name}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Описание</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Незадължително описание на категорията"
                />
              </div>
            </div>

            {/* Visual Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Визуални опции</h3>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Икона</span>
                </label>
                <select
                  name="iconName"
                  value={formData.iconName}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="label">
                  <span className="label-text-alt">Изберете икона, която да представлява тази категория</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">URL на изображение</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="https://example.com/category-image.jpg"
                />
                <label className="label">
                  <span className="label-text-alt">Незадължително изображение за заглавието на категорията</span>
                </label>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Предварителен преглед</span>
                  </label>
                  <div className="w-32 h-24 bg-base-200 rounded-lg overflow-hidden">
                    <img 
                      src={formData.imageUrl} 
                      alt="Предварителен преглед на категорията"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Настройки</h3>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-medium">Активна</span>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </label>
                <label className="label">
                  <span className="label-text-alt">Неактивните категории са скрити от клиентите</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-base-100 p-6 border-t border-base-300">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
                disabled={isLoading}
              >
                Отказ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                {category ? "Обнови категорията" : "Създай категория"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}