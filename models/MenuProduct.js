import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const menuProductSchema = mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  
  // Pricing (stored in BGN, converted to EUR for display)
  priceBGN: { 
    type: Number, 
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Price must be a positive number'
    }
  },
  
  // Organization
  position: { type: Number, required: true, default: 0 },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  
  // Product Details
  imageUrl: { type: String },
  size: { type: String, trim: true }, // e.g., "350ml", "Large", "Family Size"
  allergens: [{ type: String }], // ["gluten", "dairy", "nuts"]
  
  // Properties
  isActive: { type: Boolean, default: true },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  
  // Inventory (future feature)
  isAvailable: { type: Boolean, default: true },
  preparationTime: { type: Number }, // in minutes
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for EUR price conversion
menuProductSchema.virtual('priceEUR').get(function() {
  // Fixed rate for Bulgarian Lev to Euro (1.956)
  return Number((this.priceBGN / 1.956).toFixed(2));
});

// Add plugin that converts mongoose to json
menuProductSchema.plugin(toJSON);

// Index for efficient lookups and ordering
menuProductSchema.index({ categoryId: 1, position: 1 });
menuProductSchema.index({ restaurantId: 1 });

export default mongoose.models.MenuProduct || mongoose.model("MenuProduct", menuProductSchema);