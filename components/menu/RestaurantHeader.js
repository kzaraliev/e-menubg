"use client";

import { getUIText } from "@/libs/uiTranslations";
import config from "@/config";

export default function RestaurantHeader({ restaurant, currentLanguage = 'bg' }) {
  const formatOperatingHours = (hours) => {
    if (!hours || hours.closed || !hours.open || !hours.close) return getUIText('closed', currentLanguage);
    return `${hours.open} - ${hours.close}`;
  };

  const getCurrentDayStatus = () => {
    const today = config.menu.daysOfWeek[new Date().getDay()];
    const todayHours = restaurant.operatingHours?.[today];
    
    if (!todayHours) return null;
    
    return {
      day: today,
      hours: todayHours,
      isOpen: !todayHours.closed && todayHours.open && todayHours.close
    };
  };

  const todayStatus = getCurrentDayStatus();

  return (
    <header className="bg-gradient-to-r from-primary to-primary-focus text-primary-content">
      {restaurant.coverImageUrl && (
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${restaurant.coverImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Logo */}
          {restaurant.logoUrl && (
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0">
              <img 
                src={restaurant.logoUrl} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Restaurant Info */}
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {restaurant.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="badge badge-lg badge-accent">
                {restaurant.priceRange}
              </span>
              {todayStatus && (
                <span className={`badge badge-lg ${
                  todayStatus.isOpen ? 'badge-success' : 'badge-error'
                }`}>
                  {getUIText(todayStatus.isOpen ? 'openToday' : 'closedToday', currentLanguage)}
                </span>
              )}
            </div>
            
            {restaurant.description && (
              <p className="text-lg opacity-90 mb-4 max-w-2xl">
                {restaurant.description}
              </p>
            )}
            
            {/* Quick Contact */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {restaurant.phone && (
                <a 
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {restaurant.phone}
                </a>
              )}
              
              {restaurant.website && (
                <a 
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
              )}
              
              {todayStatus && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatOperatingHours(todayStatus.hours)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}