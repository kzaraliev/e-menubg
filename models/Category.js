import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const categorySchema = mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  
  // Organization
  position: { type: Number, required: true, default: 0 },
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  
  // Visibility
  isActive: { type: Boolean, default: true },
  
  // Additional Properties
  imageUrl: { type: String },
  iconName: { type: String }, // For font icons like 'utensils', 'coffee', etc.
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add plugin that converts mongoose to json
categorySchema.plugin(toJSON);

// Index for efficient lookups and ordering
categorySchema.index({ restaurantId: 1, position: 1 });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);