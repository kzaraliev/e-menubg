"use client";

import { useState, useEffect } from "react";

export default function TranslationField({ 
  label, 
  originalText, 
  translatedText, 
  onSave, 
  onDelete, 
  hasTranslation, 
  isLoading, 
  isTextarea = false,
  isDefaultLanguage = false 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(translatedText || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(translatedText || "");
  }, [translatedText]);

  const handleSave = async () => {
    if (!value.trim()) {
      setValue("");
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(value.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving translation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(translatedText || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await onDelete();
      setValue("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting translation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const InputComponent = isTextarea ? "textarea" : "input";
  const inputProps = isTextarea ? { rows: 3 } : { type: "text" };

  return (
    <div className="space-y-3">
      {/* Original Text */}
      <div>
        <label className="label">
          <span className="label-text font-medium">{label}</span>
          <span className="label-text-alt">Оригинален (Български)</span>
        </label>
        <div className="bg-base-200 p-3 rounded border text-sm">
          {originalText}
        </div>
      </div>

      {/* Translation */}
      <div>
        <label className="label">
          <span className="label-text font-medium">
            {isDefaultLanguage ? "Оригинален текст" : "Превод"}
          </span>
          <div className="flex items-center gap-2">
            {isDefaultLanguage ? (
              <span className="badge badge-info badge-xs">Изходен език</span>
            ) : (
              <>
                {hasTranslation && (
                  <span className="badge badge-success badge-xs">Преведен</span>
                )}
                <span className="label-text-alt">
                  {isEditing ? "Редактиране..." : "Натиснете за да редактирате"}
                </span>
              </>
            )}
          </div>
        </label>
        
        {isDefaultLanguage ? (
          // Show original text for default language (read-only)
          <div className="bg-info/10 border border-info/30 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-info font-medium">
                Това е изходният текст на български език. Преводите се създават за други езици.
              </span>
            </div>
            <div className="text-base-content font-medium">
              {originalText}
            </div>
          </div>
        ) : isEditing ? (
          <div className="space-y-3">
            <InputComponent
              {...inputProps}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input input-bordered w-full"
              placeholder={`Въведете ${label.toLowerCase()} на избрания език...`}
              disabled={isSaving}
              autoFocus
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !value.trim()}
                className="btn btn-primary btn-sm"
              >
                {isSaving && <span className="loading loading-spinner loading-xs"></span>}
                Запази
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="btn btn-ghost btn-sm"
              >
                Отказ
              </button>
              
              {hasTranslation && (
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="btn btn-error btn-outline btn-sm ml-auto"
                >
                  {isSaving && <span className="loading loading-spinner loading-xs"></span>}
                  Изтрий
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => !isLoading && setIsEditing(true)}
            className={`min-h-[3rem] p-3 rounded border cursor-pointer transition-colors ${
              hasTranslation 
                ? "bg-success/10 border-success/30 hover:bg-success/20" 
                : "bg-base-200 border-base-300 hover:bg-base-300"
            }`}
          >
            {translatedText ? (
              <span className="text-base-content">{translatedText}</span>
            ) : (
              <span className="text-base-content/50 italic">
                Натиснете за да добавите превод...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}