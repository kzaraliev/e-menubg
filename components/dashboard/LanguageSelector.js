"use client";

import { useState } from "react";
import config from "@/config";

export default function LanguageSelector({ 
  availableLanguages, 
  selectedLanguage, 
  onLanguageSelect, 
  onAddLanguage, 
  onRemoveLanguage, 
  isLoading 
}) {
  const [showAddLanguage, setShowAddLanguage] = useState(false);

  const supportedLanguages = config.menu.supportedLanguages;
  const unaddedLanguages = supportedLanguages.filter(
    lang => !availableLanguages.includes(lang.code)
  );

  const handleAddLanguage = (languageCode) => {
    onAddLanguage(languageCode);
    setShowAddLanguage(false);
  };

  return (
    <div className="space-y-4">
      {/* Current Languages */}
      <div>
        <h3 className="font-medium mb-3">Available Languages</h3>
        <div className="flex flex-wrap gap-2">
          {availableLanguages.map(langCode => {
            const langInfo = supportedLanguages.find(l => l.code === langCode);
            const isSelected = selectedLanguage === langCode;
            const isDefault = langCode === "bg";
            
            return (
              <div key={langCode} className="flex items-center gap-2">
                <button
                  onClick={() => onLanguageSelect(langCode)}
                  className={`btn btn-sm ${
                    isSelected ? 'btn-primary' : 'btn-outline'
                  }`}
                  disabled={isLoading}
                >
                  <span className="mr-2">{langInfo?.flag || '🏳️'}</span>
                  {langInfo?.name || langCode}
                  {isDefault && (
                    <span className="badge badge-xs badge-warning ml-2">Default</span>
                  )}
                </button>
                
                {!isDefault && (
                  <button
                    onClick={() => onRemoveLanguage(langCode)}
                    className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
                    disabled={isLoading}
                    title="Remove language"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Language */}
      {unaddedLanguages.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Add New Language</h3>
          
          {showAddLanguage ? (
            <div className="flex flex-wrap gap-2">
              {unaddedLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleAddLanguage(lang.code)}
                  className="btn btn-outline btn-sm"
                  disabled={isLoading}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
              <button
                onClick={() => setShowAddLanguage(false)}
                className="btn btn-ghost btn-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddLanguage(true)}
              className="btn btn-outline btn-sm"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Language
            </button>
          )}
        </div>
      )}

      {/* Language Notes */}
      <div className="text-sm text-base-content/70">
        <p>
          <strong>Note:</strong> Bulgarian (🇧🇬) is the default language and cannot be removed. 
          Customers will see Bulgarian text when translations are not available.
        </p>
      </div>
    </div>
  );
}