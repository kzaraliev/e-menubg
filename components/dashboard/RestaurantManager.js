"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import RestaurantForm from "./RestaurantForm";
import RestaurantPreview from "./RestaurantPreview";
import FixOperatingHours from "./FixOperatingHours";

export default function RestaurantManager({ initialRestaurant, userId }) {
  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // Check if operating hours need fixing
  const needsOperatingHoursFix = restaurant && restaurant.operatingHours && 
    Object.values(restaurant.operatingHours).some(hours => 
      !hours.open || !hours.close
    );

  const handleSave = async (restaurantData) => {
    setIsLoading(true);
    try {
      const url = restaurant ? "/api/restaurant" : "/api/restaurant";
      const method = restaurant ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurantData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save restaurant");
      }

      const updatedRestaurant = await response.json();
      setRestaurant(updatedRestaurant);
      toast.success(restaurant ? "Restaurant updated successfully!" : "Restaurant created successfully!");
      
      // If it's a new restaurant, redirect to menu management
      if (!restaurant) {
        setTimeout(() => {
          window.location.href = "/dashboard/menu";
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!restaurant) return;
    
    if (!confirm("Are you sure you want to delete your restaurant? This action cannot be undone and will delete all categories and menu items.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/restaurant", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete restaurant");
      }

      setRestaurant(null);
      toast.success("Restaurant deleted successfully!");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {restaurant && (
        <div className="tabs tabs-bordered">
          <button 
            className={`tab ${activeTab === "edit" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit Restaurant
          </button>
          <button 
            className={`tab ${activeTab === "preview" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
      )}

      {activeTab === "edit" && (
        <div className="space-y-6">
          {needsOperatingHoursFix && (
            <FixOperatingHours onFixed={(fixedHours) => {
              setRestaurant(prev => ({
                ...prev,
                operatingHours: fixedHours
              }));
            }} />
          )}
          
          <RestaurantForm 
            restaurant={restaurant}
            onSave={handleSave}
            isLoading={isLoading}
          />
          
          {restaurant && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title text-error">Danger Zone</h3>
                <p className="text-sm opacity-70">
                  Deleting your restaurant will permanently remove all data including categories, menu items, and translations.
                </p>
                <div className="card-actions">
                  <button 
                    className="btn btn-error btn-outline"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    Delete Restaurant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "preview" && restaurant && (
        <RestaurantPreview restaurant={restaurant} />
      )}
    </div>
  );
}