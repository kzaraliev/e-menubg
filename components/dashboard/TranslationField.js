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
  isTextarea = false 
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
          <span className="label-text-alt">Original (Bulgarian)</span>
        </label>
        <div className="bg-base-200 p-3 rounded border text-sm">
          {originalText}
        </div>
      </div>

      {/* Translation */}
      <div>
        <label className="label">
          <span className="label-text font-medium">Translation</span>
          <div className="flex items-center gap-2">
            {hasTranslation && (
              <span className="badge badge-success badge-xs">Translated</span>
            )}
            <span className="label-text-alt">
              {isEditing ? "Editing..." : "Click to edit"}
            </span>
          </div>
        </label>
        
        {isEditing ? (
          <div className="space-y-3">
            <InputComponent
              {...inputProps}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input input-bordered w-full"
              placeholder={`Enter ${label.toLowerCase()} in selected language...`}
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
                Save
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              
              {hasTranslation && (
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="btn btn-error btn-outline btn-sm ml-auto"
                >
                  {isSaving && <span className="loading loading-spinner loading-xs"></span>}
                  Delete
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
                Click to add translation...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}