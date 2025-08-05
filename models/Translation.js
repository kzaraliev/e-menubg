import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const translationSchema = mongoose.Schema({
  // Target Information
  entityType: { 
    type: String, 
    required: true, 
    enum: ['restaurant', 'category', 'menuProduct'] 
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  field: { 
    type: String, 
    required: true 
  }, // e.g., 'name', 'description'
  
  // Translation
  language: { 
    type: String, 
    required: true, 
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[a-z]{2}$/.test(v);
      },
      message: 'Language must be a 2-character language code'
    }
  },
  translatedText: { type: String, required: true, trim: true },
  
  // Meta
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add plugin that converts mongoose to json
translationSchema.plugin(toJSON);

// Compound index for efficient lookups and ensuring uniqueness
translationSchema.index({ entityType: 1, entityId: 1, field: 1, language: 1 }, { unique: true });
translationSchema.index({ restaurantId: 1, language: 1 });

export default mongoose.models.Translation || mongoose.model("Translation", translationSchema);