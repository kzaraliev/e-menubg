"use client";

import { useState, useEffect } from "react";

import ImageUpload from "@/components/ImageUpload";
import config from "@/config";

export default function ProductForm({ product, category, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceBGN: "",
    imageUrl: "",
    size: "",
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    isPopular: false,
    isActive: true,
    isAvailable: true,
    preparationTime: ""
  });

  const [errors, setErrors] = useState({});
  const [allergenInput, setAllergenInput] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        priceBGN: product.priceBGN?.toString() || "",
        imageUrl: product.imageUrl || "",
        size: product.size || "",
        allergens: product.allergens || [],
        isVegetarian: product.isVegetarian || false,
        isVegan: product.isVegan || false,
        isSpicy: product.isSpicy || false,
        isPopular: product.isPopular || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        preparationTime: product.preparationTime?.toString() || ""
      });
    }
  }, [product]);

  const commonAllergens = config.menu.allergens;

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

  const addAllergen = (allergen) => {
    if (allergen && !formData.allergens.includes(allergen)) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergen]
      }));
    }
    setAllergenInput("");
  };

  const removeAllergen = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  const calculateEURPrice = (bgnPrice) => {
    const numPrice = parseFloat(bgnPrice);
    if (isNaN(numPrice)) return "0.00";
    return (numPrice / config.menu.bgnToEurRate).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Името на продукта е задължително";
    }
    
    if (!formData.priceBGN || parseFloat(formData.priceBGN) <= 0) {
      newErrors.priceBGN = "Нуждает се валидна цена";
    }
    
    if (formData.preparationTime && (isNaN(formData.preparationTime) || parseInt(formData.preparationTime) < 0)) {
      newErrors.preparationTime = "Времето за приготвяне трябва да е положително число";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData = {
      ...formData,
      priceBGN: parseFloat(formData.priceBGN),
      preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null
    };
    
    // Debug logging
    console.log("Product form data being submitted:", submitData);
    console.log("Price as number:", parseFloat(formData.priceBGN));
    
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-base-100 p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {product ? "Редактирай продукт" : "Добави продукт"} 
                <span className="text-base font-normal text-base-content/70 ml-2">
                  в {category.name}
                </span>
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

          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Основна информация</h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Име на продукта *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                    placeholder="напр. Маргарита Пица"
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
                    placeholder="Опишете съставките, начина на приготвяне или какво прави този продукт специален"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Размер/Порция</span>
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="напр. 350мл, Голям, Семеен размер"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Време за приготвяне (минути)</span>
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    className={`input input-bordered ${errors.preparationTime ? "input-error" : ""}`}
                    placeholder="15"
                    min="0"
                  />
                  {errors.preparationTime && <span className="text-error text-sm mt-1">{errors.preparationTime}</span>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Цени и изображение</h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Цена (лв.) *</span>
                  </label>
                  <input
                    type="number"
                    name="priceBGN"
                    value={formData.priceBGN}
                    onChange={handleInputChange}
                    className={`input input-bordered ${errors.priceBGN ? "input-error" : ""}`}
                    placeholder="12.50"
                    step="0.01"
                    min="0"
                    required
                  />
                  {errors.priceBGN && <span className="text-error text-sm mt-1">{errors.priceBGN}</span>}
                  {formData.priceBGN && (
                    <label className="label">
                      <span className="label-text-alt">
                        = €{calculateEURPrice(formData.priceBGN)} EUR
                      </span>
                    </label>
                  )}
                </div>

                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onImageChange={(imageUrl) => {
                    setFormData(prev => ({ ...prev, imageUrl }));
                  }}
                  uploadType="product"
                  disabled={isLoading}
                  placeholder="Качете изображение на продукта"
                />
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Алергени</h3>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Добави алерген</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    className="input input-bordered flex-1"
                    placeholder="Въведете име на алерген"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAllergen(allergenInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addAllergen(allergenInput)}
                    className="btn btn-outline"
                  >
                    Добави
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Общи алергени</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonAllergens.map(allergen => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => addAllergen(allergen)}
                      className={`btn btn-sm ${
                        formData.allergens.includes(allergen) 
                          ? 'btn-primary' 
                          : 'btn-outline'
                      }`}
                      disabled={formData.allergens.includes(allergen)}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>

              {formData.allergens.length > 0 && (
                <div className="space-y-2">
                  <label className="label">
                    <span className="label-text font-medium">Избрани алергени</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergens.map(allergen => (
                      <div key={allergen} className="badge badge-primary gap-2">
                        {allergen}
                        <button
                          type="button"
                          onClick={() => removeAllergen(allergen)}
                          className="btn btn-ghost btn-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Свойства на продукта</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Вегетарианско</span>
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      className="checkbox checkbox-success"
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Веганско</span>
                    <input
                      type="checkbox"
                      name="isVegan"
                      checked={formData.isVegan}
                      onChange={handleInputChange}
                      className="checkbox checkbox-success"
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Остро 🌶️</span>
                    <input
                      type="checkbox"
                      name="isSpicy"
                      checked={formData.isSpicy}
                      onChange={handleInputChange}
                      className="checkbox checkbox-warning"
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Популярно</span>
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleInputChange}
                      className="checkbox checkbox-secondary"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Статус</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Активен</span>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary"
                    />
                  </label>
                  <label className="label">
                    <span className="label-text-alt">Неактивните продукти са скрити от клиентите</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Наличен</span>
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary"
                    />
                  </label>
                  <label className="label">
                    <span className="label-text-alt">Неналичните продукти се показват като &ldquo;Няма на склад&rdquo;</span>
                  </label>
                </div>
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
                {product ? "Обнови продукта" : "Създай продукт"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}