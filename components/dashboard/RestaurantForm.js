"use client";

import { useState, useEffect } from "react";

import ImageUpload from "@/components/ImageUpload";
import config from "@/config";

export default function RestaurantForm({ restaurant, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    priceRange: config.menu.priceRanges[1], // Default to $$
    logoUrl: "",
    coverImageUrl: "",
    operatingHours: { ...config.menu.defaultOperatingHours },
    settings: {
      showPricesInEuro: true,
      showPricesInBGN: true,
      defaultLanguage: "bg",
      availableLanguages: ["bg"],
      allowOnlineOrdering: false
    }
  });

  const [errors, setErrors] = useState({});
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (restaurant) {
      // Merge existing operating hours with defaults to ensure all fields are present
      const defaultHours = {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "22:00", closed: false },
        saturday: { open: "09:00", close: "22:00", closed: true },
        sunday: { open: "09:00", close: "22:00", closed: true }
      };
      
      const mergedOperatingHours = {};
      Object.keys(defaultHours).forEach(day => {
        mergedOperatingHours[day] = {
          ...defaultHours[day],
          ...(restaurant.operatingHours && restaurant.operatingHours[day] ? restaurant.operatingHours[day] : {})
        };
      });

      setFormData({
        name: restaurant.name || "",
        slug: restaurant.slug || "",
        address: restaurant.address || "",
        email: restaurant.email || "",
        phone: restaurant.phone || "",
        website: restaurant.website || "",
        description: restaurant.description || "",
        priceRange: restaurant.priceRange || config.menu.priceRanges[1],
        logoUrl: restaurant.logoUrl || "",
        coverImageUrl: restaurant.coverImageUrl || "",
        operatingHours: mergedOperatingHours,
        settings: { ...formData.settings, ...restaurant.settings }
      });
      // For existing restaurants, consider the slug as manually set
      setIsSlugManuallyEdited(true);
    }
  }, [restaurant, formData.settings]);

  const generateSlug = (name) => {
    // Transliteration map for Bulgarian Cyrillic to Latin
    // Examples: "Немо" -> "nemo", "Пица Мания" -> "pica-mania", "Старата Къща" -> "starata-kashta"
    const transliterationMap = {
      // Bulgarian Cyrillic
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      
      // Additional Bulgarian specific
      'ѝ': 'i', // Macedonian/Bulgarian specific i
      
      // Uppercase versions
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A',
      'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
      'Ѝ': 'I',
      
      // Additional common characters
      'ñ': 'n', 'Ñ': 'N', 'ç': 'c', 'Ç': 'C', 'ş': 's', 'Ş': 'S',
      'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O',
      'ü': 'u', 'Ü': 'U', 'á': 'a', 'Á': 'A', 'é': 'e', 'É': 'E',
      'í': 'i', 'Í': 'I', 'ó': 'o', 'Ó': 'O', 'ú': 'u', 'Ú': 'U'
    };

    return name
      .trim()
      // Apply transliteration
      .split('')
      .map(char => transliterationMap[char] || char)
      .join('')
      // Convert to lowercase
      .toLowerCase()
      // Remove any remaining non-alphanumeric characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace multiple spaces/hyphens with single hyphen
      .replace(/[\s_-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
  };

  const regenerateSlug = () => {
    const newSlug = generateSlug(formData.name);
    setFormData(prev => ({
      ...prev,
      slug: newSlug
    }));
    setIsSlugManuallyEdited(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "name") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Auto-generate slug only if it hasn't been manually edited
        slug: !isSlugManuallyEdited ? generateSlug(value) : prev.slug
      }));
    } else if (name === "slug") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Mark slug as manually edited if user changes it
      setIsSlugManuallyEdited(true);
    } else if (name.startsWith("settings.")) {
      const settingKey = name.replace("settings.", "");
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => {
      const updatedDay = {
        ...prev.operatingHours[day],
        [field]: value
      };
      
      // If setting closed to true, keep the open/close times but mark as closed
      // If setting closed to false, ensure we have default open/close times
      if (field === 'closed' && value === false) {
        if (!updatedDay.open) updatedDay.open = "09:00";
        if (!updatedDay.close) updatedDay.close = "22:00";
      }
      
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: updatedDay
        }
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Името на ресторанта е задължително";
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = "URL slug е задължително";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug може да съдържа само малки букви, цифри и тирета";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Моля, въведете валиден имейл адрес";
    }
    
    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "URL на уебсайта трябва да започва с http:// или https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Ensure operating hours have complete data before saving
    const completeOperatingHours = {};
    Object.keys(formData.operatingHours).forEach(day => {
      const dayData = formData.operatingHours[day];
      completeOperatingHours[day] = {
        open: dayData.open || "09:00",
        close: dayData.close || "22:00", 
        closed: dayData.closed || false
      };
    });
    
    const dataToSave = {
      ...formData,
      operatingHours: completeOperatingHours
    };
    
    // Debug logging
    console.log("Form data being saved:", dataToSave);
    console.log("Operating hours:", completeOperatingHours);
    
    onSave(dataToSave);
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayNames = {
    monday: "Понеделник",
    tuesday: "Вторник", 
    wednesday: "Сряда",
    thursday: "Четвъртък",
    friday: "Петък",
    saturday: "Събота",
    sunday: "Неделя"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Основна информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Име на ресторанта *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                placeholder="Моят ресторант"
                required
              />
              {errors.name && <span className="text-error text-sm">{errors.name}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">URL Slug *</span>
                {!isSlugManuallyEdited && (
                  <span className="label-text-alt text-success">🔄 Автоматично генериран</span>
                )}
              </label>
              <div className="join w-full">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`input input-bordered join-item flex-1 ${errors.slug ? "input-error" : ""}`}
                  placeholder="моят-ресторант"
                  required
                />
                <button
                  type="button"
                  onClick={regenerateSlug}
                  className="btn btn-outline join-item"
                  title="Прегенерирай slug от името на ресторанта"
                  disabled={!formData.name.trim()}
                >
                  🔄
                </button>
              </div>
              {errors.slug && <span className="text-error text-sm">{errors.slug}</span>}
              <div className="text-xs opacity-70 mt-1">
                <div>Вашето меню ще бъде достъпно на: <span className="font-mono">{config.domainName}/{formData.slug}</span></div>
                {!isSlugManuallyEdited && (
                  <div className="text-success">✨ Автоматично генерирано от името на ресторанта с транслитерация</div>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Ценова категория</span>
              </label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                className="select select-bordered"
              >
                {config.menu.priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range} - {range === '$' ? 'Бюджетно' : range === '$$' ? 'Умерено' : range === '$$$' ? 'Скъпо' : 'Много скъпо'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Описание</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24"
              placeholder="Разкажете на клиентите за вашия ресторант..."
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Изображения</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImageUpload
              currentImageUrl={formData.logoUrl}
              onImageChange={(imageUrl) => {
                setFormData(prev => ({ ...prev, logoUrl: imageUrl }));
              }}
              uploadType="restaurant-logo"
              disabled={isLoading}
              placeholder="Качете лого на ресторанта"
              className="w-full"
            />
            
            <ImageUpload
              currentImageUrl={formData.coverImageUrl}
              onImageChange={(imageUrl) => {
                setFormData(prev => ({ ...prev, coverImageUrl: imageUrl }));
              }}
              uploadType="restaurant-cover"
              disabled={isLoading}
              placeholder="Качете заглавно изображение"
              className="w-full"
            />
          </div>
          
          <div className="text-sm text-base-content/60 mt-4">
            <p><strong>Лого:</strong> Препоръчителен размер 400x400px, ще се използва в менюто и профила</p>
            <p><strong>Заглавно изображение:</strong> Препоръчителен размер 1200x600px, ще се показва в горната част на менюто</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Контактна информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Адрес</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-20"
                placeholder="Адрес, град, пощенски код"
              />
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Имейл</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                  placeholder="ресторант@example.com"
                />
                {errors.email && <span className="text-error text-sm">{errors.email}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Телефон</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="+359 88 123 4567"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Уебсайт</span>
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.website ? "input-error" : ""}`}
                  placeholder="https://www.моятресторант.com"
                />
                {errors.website && <span className="text-error text-sm">{errors.website}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Работно време</h2>
          
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 font-medium">{dayNames[day]}</div>
                
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.operatingHours[day].closed}
                      onChange={(e) => handleOperatingHoursChange(day, "closed", e.target.checked)}
                      className="checkbox checkbox-sm"
                    />
                    <span className="label-text ml-2">Затворено</span>
                  </label>
                </div>
                
                {!formData.operatingHours[day].closed && (
                  <>
                    <input
                      type="time"
                      value={formData.operatingHours[day].open}
                      onChange={(e) => handleOperatingHoursChange(day, "open", e.target.value)}
                      className="input input-bordered input-sm"
                    />
                    <span>до</span>
                    <input
                      type="time"
                      value={formData.operatingHours[day].close}
                      onChange={(e) => handleOperatingHoursChange(day, "close", e.target.value)}
                      className="input input-bordered input-sm"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Настройки на менюто</h2>
          
          <div className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Показвай цени в лева</span>
                <input
                  type="checkbox"
                  name="settings.showPricesInBGN"
                  checked={formData.settings.showPricesInBGN}
                  onChange={handleInputChange}
                  className="checkbox"
                />
              </label>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Показвай цени в евро</span>
                <input
                  type="checkbox"
                  name="settings.showPricesInEuro"
                  checked={formData.settings.showPricesInEuro}
                  onChange={handleInputChange}
                  className="checkbox"
                />
              </label>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Разреши онлайн поръчки (Очаквайте скоро)</span>
                <input
                  type="checkbox"
                  name="settings.allowOnlineOrdering"
                  checked={formData.settings.allowOnlineOrdering}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner loading-sm"></span>}
          {restaurant ? "Обнови ресторанта" : "Създай ресторант"}
        </button>
      </div>
    </form>
  );
}