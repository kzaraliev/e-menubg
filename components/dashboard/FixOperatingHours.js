"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function FixOperatingHours({ onFixed }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFixHours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/restaurant/fix-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fix operating hours");
      }

      const result = await response.json();
      toast.success("Operating hours fixed successfully!");
      console.log("Fixed hours:", result.operatingHours);
      
      if (onFixed) {
        onFixed(result.operatingHours);
      }
      
      // Refresh the page to see updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error fixing operating hours:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-warning/10 border border-warning">
      <div className="card-body">
        <h3 className="card-title text-warning">Operating Hours Issue Detected</h3>
        <p className="text-sm">
          Your restaurant's operating hours are missing open/close times. This causes display issues like "undefined - undefined".
        </p>
        <p className="text-sm">
          Click the button below to automatically fix this issue.
        </p>
        <div className="card-actions">
          <button
            onClick={handleFixHours}
            disabled={isLoading}
            className="btn btn-warning"
          >
            {isLoading && <span className="loading loading-spinner loading-sm"></span>}
            Fix Operating Hours
          </button>
        </div>
      </div>
    </div>
  );
}