"use client";

import config from "@/config";
import Link from "next/link";

export default function RestaurantPreview({ restaurant }) {
  const formatOperatingHours = (hours) => {
    if (hours.closed || !hours.open || !hours.close) return "Затворено";
    return `${hours.open} - ${hours.close}`;
  };

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
    <div className="space-y-6">
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Така ще изглежда информацията за вашия ресторант за клиентите. Вашето меню ще бъде достъпно на: <strong>{config.domainName}/{restaurant.slug}</strong></span>
      </div>

      {/* Restaurant Header */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-start gap-6">
            {restaurant.logoUrl && (
              <div className="w-24 h-24 bg-base-200 rounded-lg flex items-center justify-center">
                <img 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              
              <div className="flex items-center gap-4 mt-2">
                
                <span className="badge badge-primary">{restaurant.priceRange}</span>
              </div>
              
              {restaurant.description && (
                <p className="mt-4 text-base-content/70">{restaurant.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Контактна информация</h2>
            
            <div className="space-y-3">
              {restaurant.address && (
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{restaurant.address}</span>
                </div>
              )}
              
              {restaurant.phone && (
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{restaurant.phone}</span>
                </div>
              )}
              
              {restaurant.email && (
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{restaurant.email}</span>
                </div>
              )}
              
              {restaurant.website && (
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <Link
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm link link-primary"
                  >
                    {restaurant.website}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Работно време</h2>
            
            <div className="space-y-2">
              {Object.entries(restaurant.operatingHours || {}).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{dayNames[day] || day}</span>
                  <span className={`text-sm ${hours.closed ? 'text-base-content/50' : ''}`}>
                    {formatOperatingHours(hours)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Settings Preview */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Menu Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Price Display</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={restaurant.settings?.showPricesInBGN} 
                    disabled 
                    className="checkbox checkbox-sm"
                  />
                  <span className="text-sm">Show prices in BGN</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={restaurant.settings?.showPricesInEuro} 
                    disabled 
                    className="checkbox checkbox-sm"
                  />
                  <span className="text-sm">Show prices in EUR</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.settings?.availableLanguages?.map(lang => {
                  const langConfig = config.menu.supportedLanguages.find(l => l.code === lang);
                  return (
                    <span key={lang} className="badge badge-outline">
                      {langConfig?.flag} {langConfig?.name || lang}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat">
              <div className="stat-title">Visibility</div>
              <div className={`stat-value text-lg ${restaurant.isPublished ? 'text-success' : 'text-warning'}`}>
                {restaurant.isPublished ? 'Published' : 'Draft'}
              </div>
              <div className="stat-desc">
                {restaurant.isPublished ? 'Menu is visible to customers' : 'Menu is hidden from customers'}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Created</div>
              <div className="stat-value text-lg">
                {new Date(restaurant.createdAt).toLocaleDateString()}
              </div>
              <div className="stat-desc">Restaurant created</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Last Updated</div>
              <div className="stat-value text-lg">
                {new Date(restaurant.updatedAt).toLocaleDateString()}
              </div>
              <div className="stat-desc">Profile updated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}