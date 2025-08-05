import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const restaurantSchema = mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  },
  
  // Contact Information
  address: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  
  // Additional Information
  description: { type: String, trim: true },
  logoUrl: { type: String },
  coverImageUrl: { type: String },
  
  // Business Details
  priceRange: { 
    type: String, 
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  
  // Operating Hours (flexible structure for future expansion)
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  
  // Ownership & Status
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false }, // Controlled by subscription status
  
  // Settings
  settings: {
    showPricesInEuro: { type: Boolean, default: true },
    showPricesInBGN: { type: Boolean, default: true },
    defaultLanguage: { type: String, default: 'bg' },
    availableLanguages: [{ type: String, default: ['bg'] }],
    allowOnlineOrdering: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);

// Index for efficient lookups
restaurantSchema.index({ slug: 1 }, { unique: true });
restaurantSchema.index({ ownerId: 1 });

export default mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);