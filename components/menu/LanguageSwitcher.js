"use client";

import { useState, useEffect, useRef } from "react";
import config from "@/config";
import { getUIText } from "@/libs/uiTranslations";

export default function LanguageSwitcher({ currentLanguage, availableLanguages, onLanguageChange, isTranslating }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supportedLanguages = config.menu.supportedLanguages;
  
  const currentLangInfo = supportedLanguages.find(l => l.code === currentLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode);
    setIsDropdownOpen(false);
  };

  // Only show if there are multiple languages
  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <div className="bg-base-200 border-b border-base-300">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-base-content/70">
            {getUIText('availableLanguages', currentLanguage)}
          </div>
          
          <div className="dropdown dropdown-end" ref={dropdownRef}>
            <div 
              tabIndex={0} 
              role="button" 
              className={`btn btn-sm btn-ghost ${isTranslating ? 'loading' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <span className="mr-2">{currentLangInfo?.flag || '🏳️'}</span>
                  <span className="hidden sm:inline mr-1">{currentLangInfo?.name || currentLanguage}</span>
                  <span className="sm:hidden mr-1">{currentLanguage.toUpperCase()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </div>
            
            {isDropdownOpen && (
              <ul 
                tabIndex={0} 
                className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-48 border border-base-300"
                onClick={() => setIsDropdownOpen(false)}
              >
                {availableLanguages.map(langCode => {
                  const langInfo = supportedLanguages.find(l => l.code === langCode);
                  const isActive = currentLanguage === langCode;
                  
                  return (
                    <li key={langCode}>
                      <button
                        onClick={() => handleLanguageSelect(langCode)}
                        className={`flex items-center gap-3 ${isActive ? 'active' : ''}`}
                        disabled={isTranslating}
                      >
                        <span className="text-lg">{langInfo?.flag || '🏳️'}</span>
                        <span className="flex-1">{langInfo?.name || langCode}</span>
                        {isActive && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}