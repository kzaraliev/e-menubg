"use client";

import { useState, useEffect } from "react";
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
  }, [restaurant]);

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
      newErrors.name = "Restaurant name is required";
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = "URL slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "Website URL must start with http:// or https://";
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
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Restaurant Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                placeholder="My Restaurant"
                required
              />
              {errors.name && <span className="text-error text-sm">{errors.name}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">URL Slug *</span>
                {!isSlugManuallyEdited && (
                  <span className="label-text-alt text-success">🔄 Auto-generated</span>
                )}
              </label>
              <div className="join w-full">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`input input-bordered join-item flex-1 ${errors.slug ? "input-error" : ""}`}
                  placeholder="my-restaurant"
                  required
                />
                <button
                  type="button"
                  onClick={regenerateSlug}
                  className="btn btn-outline join-item"
                  title="Regenerate slug from restaurant name"
                  disabled={!formData.name.trim()}
                >
                  🔄
                </button>
              </div>
              {errors.slug && <span className="text-error text-sm">{errors.slug}</span>}
              <div className="text-xs opacity-70 mt-1">
                <div>Your menu will be available at: <span className="font-mono">{config.domainName}/{formData.slug}</span></div>
                {!isSlugManuallyEdited && (
                  <div className="text-success">✨ Automatically generated from restaurant name with transliteration</div>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Price Range</span>
              </label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                className="select select-bordered"
              >
                {config.menu.priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range} - {range === '$' ? 'Budget' : range === '$$' ? 'Moderate' : range === '$$$' ? 'Expensive' : 'Very Expensive'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24"
              placeholder="Tell customers about your restaurant..."
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-20"
                placeholder="Street address, city, postal code"
              />
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                  placeholder="restaurant@example.com"
                />
                {errors.email && <span className="text-error text-sm">{errors.email}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
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
                  <span className="label-text">Website</span>
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.website ? "input-error" : ""}`}
                  placeholder="https://www.myrestaurant.com"
                />
                {errors.website && <span className="text-error text-sm">{errors.website}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Operating Hours</h2>
          
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
                    <span className="label-text ml-2">Closed</span>
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
                    <span>to</span>
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
          <h2 className="card-title">Menu Settings</h2>
          
          <div className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Show prices in BGN</span>
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
                <span className="label-text">Show prices in EUR</span>
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
                <span className="label-text">Allow online ordering (Coming soon)</span>
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
          {restaurant ? "Update Restaurant" : "Create Restaurant"}
        </button>
      </div>
    </form>
  );
}