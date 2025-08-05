# Digital Menu Platform Implementation Plan

## Project Overview
This document outlines the implementation plan for a digital menu platform built on top of the existing ShipFast boilerplate. The platform allows restaurant owners to create, manage, and publish digital menus with multi-language support.

## Core Business Logic
1. **User Flow**: User registers → pays subscription → creates restaurant → builds menu
2. **Access Control**: Active subscription = public menu visibility + full editing
3. **URL Structure**: `domain.com/{restaurant-slug}` for public menus
4. **Limitation**: One restaurant per user profile
5. **Multi-currency**: Display prices in both EUR and BGN (Bulgaria entering Eurozone)

## Database Schema Design

### 1. Restaurant Model (`models/Restaurant.js`)
```javascript
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
```

### 2. Category Model (`models/Category.js`)
```javascript
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
```

### 3. MenuProduct Model (`models/MenuProduct.js`)
```javascript
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
```

### 4. Translation Model (`models/Translation.js`)
```javascript
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

// Compound index for efficient lookups
translationSchema.index({ entityType: 1, entityId: 1, field: 1, language: 1 }, { unique: true });
```

## API Routes Structure

### Restaurant Management
- `POST /api/restaurant` - Create restaurant (requires active subscription)
- `GET /api/restaurant` - Get user's restaurant
- `PUT /api/restaurant` - Update restaurant
- `DELETE /api/restaurant` - Delete restaurant (cascade delete categories/products)

### Category Management
- `POST /api/restaurant/[restaurantId]/categories` - Create category
- `GET /api/restaurant/[restaurantId]/categories` - List categories
- `PUT /api/category/[categoryId]` - Update category
- `DELETE /api/category/[categoryId]` - Delete category (cascade delete products)
- `PUT /api/category/[categoryId]/reorder` - Update category positions

### Menu Product Management
- `POST /api/category/[categoryId]/products` - Create menu product
- `GET /api/category/[categoryId]/products` - List products in category
- `PUT /api/product/[productId]` - Update product
- `DELETE /api/product/[productId]` - Delete product
- `PUT /api/product/[productId]/reorder` - Update product positions

### Translation Management
- `POST /api/translations` - Create/update translation
- `GET /api/restaurant/[restaurantId]/translations` - Get all translations
- `DELETE /api/translation/[translationId]` - Delete translation
- `PUT /api/restaurant/[restaurantId]/languages` - Update available languages

### Public Menu API
- `GET /api/menu/[slug]` - Get public menu data (with translations)
- `GET /api/menu/[slug]/categories` - Get categories with products
- `GET /api/restaurant/[slug]/info` - Get restaurant public information

## Frontend Components Structure

### Dashboard Components (`components/dashboard/`)

#### Restaurant Management
- `RestaurantForm.js` - Restaurant creation/editing form
- `RestaurantSettings.js` - Restaurant settings panel
- `RestaurantPreview.js` - Preview how menu looks publicly

#### Menu Management
- `CategoryList.js` - Drag-and-drop category management
- `CategoryForm.js` - Category creation/editing modal
- `ProductList.js` - Product management within categories
- `ProductForm.js` - Product creation/editing modal
- `MenuPreview.js` - Live preview of the menu

#### Translation Management
- `TranslationPanel.js` - Language management interface
- `TranslationForm.js` - Translation creation/editing
- `LanguageSelector.js` - Available languages configuration

#### Utility Components
- `ImageUpload.js` - Image upload with preview
- `PriceInput.js` - Dual currency price input (BGN/EUR)
- `DragAndDrop.js` - Reusable drag-and-drop for ordering
- `AccessGuard.js` - Subscription access control wrapper

### Public Menu Components (`components/menu/`)
- `MenuLayout.js` - Public menu layout wrapper
- `RestaurantHeader.js` - Restaurant info display
- `CategorySection.js` - Category with products
- `ProductCard.js` - Individual product display
- `LanguageSwitcher.js` - Public language switching
- `MenuNavigation.js` - Category navigation/filtering

## Dashboard Implementation

### Main Dashboard Structure (`app/dashboard/`)

#### Core Dashboard Pages
1. **`page.js`** - Dashboard overview with restaurant status
2. **`restaurant/page.js`** - Restaurant management
3. **`menu/page.js`** - Menu management interface
4. **`translations/page.js`** - Translation management
5. **`settings/page.js`** - Account and restaurant settings

#### Access Control Logic
```javascript
// Add to existing User model or create middleware
const checkSubscriptionAccess = async (userId) => {
  const user = await User.findById(userId);
  return user?.hasAccess || false;
};

const checkMenuVisibility = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId).populate('ownerId');
  return restaurant?.ownerId?.hasAccess && restaurant?.isPublished;
};
```

### Dashboard Features

#### 1. Restaurant Management Dashboard
- Restaurant profile setup and editing
- URL slug management with validation
- Logo and cover image upload
- Operating hours configuration
- Contact information management

#### 2. Menu Builder Interface
- Visual category and product management
- Drag-and-drop reordering
- Real-time preview
- Bulk actions (import/export)
- Price calculator (BGN to EUR conversion)

#### 3. Translation Management
- Language activation/deactivation
- Translation progress tracking
- Bulk translation features
- Translation validation and preview

#### 4. Analytics Dashboard (Future Enhancement)
- Menu view statistics
- Popular items tracking
- Customer engagement metrics

## Public Menu Display

### Menu Page Implementation (`app/[slug]/page.js`)
```javascript
export default async function PublicMenu({ params }) {
  const { slug } = params;
  
  // Fetch restaurant and menu data
  const restaurant = await Restaurant.findOne({ slug }).populate('ownerId');
  
  // Check if menu should be visible
  if (!restaurant?.ownerId?.hasAccess || !restaurant?.isPublished) {
    return notFound();
  }
  
  // Fetch menu structure with translations
  const categories = await Category.find({ restaurantId: restaurant._id, isActive: true })
    .sort({ position: 1 });
    
  const products = await MenuProduct.find({ 
    restaurantId: restaurant._id, 
    isActive: true 
  }).sort({ position: 1 });
  
  // Apply translations based on language preference
  const menuData = await applyTranslations(restaurant, categories, products, language);
  
  return <MenuLayout restaurant={menuData.restaurant} categories={menuData.categories} />;
}
```

### Key Features
- Responsive design for mobile and desktop
- SEO optimization with dynamic meta tags
- Social media sharing with Open Graph tags
- Progressive Web App capabilities
- Offline-first approach with service workers

## Translation System Implementation

### Translation Service (`libs/translations.js`)
```javascript
export const getTranslation = async (entityType, entityId, field, language, restaurantId) => {
  const translation = await Translation.findOne({
    entityType,
    entityId,
    field,
    language,
    restaurantId,
    isActive: true
  });
  
  return translation?.translatedText || null;
};

export const applyTranslations = async (restaurant, categories, products, language = 'bg') => {
  // Apply translations to all entities
  // Return translated data structure
};

export const createBulkTranslations = async (restaurantId, targetLanguage, sourceLanguage = 'bg') => {
  // Implement bulk translation creation
  // Could integrate with Google Translate API for automation
};
```

### Translation Features
- Support for multiple languages simultaneously
- Fallback to default language if translation missing
- Translation validation and completeness tracking
- Bulk translation operations
- Integration ready for translation services (Google Translate, DeepL)

## Additional Features & Considerations

### 1. Image Management
- Integration with cloud storage (AWS S3, Cloudinary)
- Image optimization and resizing
- Multiple image formats support
- Image compression for faster loading

### 2. SEO & Performance
- Dynamic sitemap generation for restaurant pages
- Schema.org markup for restaurants and menus
- Image lazy loading and optimization
- Critical CSS inlining for faster initial load

### 3. Security Considerations
- Input validation and sanitization
- Rate limiting on API endpoints
- CSRF protection
- Secure file upload handling
- SQL injection prevention through Mongoose

### 4. Backup & Recovery
- Automated database backups
- Data export functionality for restaurant owners
- Version control for menu changes
- Audit logs for administrative actions

## Integration with Existing System

### 1. User Model Updates
```javascript
// Add to existing User schema
restaurantId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Restaurant',
  default: null
},
lastMenuUpdate: {
  type: Date,
  default: Date.now
}
```

### 2. Subscription Webhook Updates
```javascript
// Add to existing Stripe webhook (app/api/webhook/stripe/route.js)
case "invoice.paid": {
  // Existing logic...
  
  // Update restaurant visibility
  if (user.hasAccess) {
    await Restaurant.updateOne(
      { ownerId: user._id },
      { isPublished: true }
    );
  }
  break;
}

case "customer.subscription.deleted": {
  // Existing logic...
  
  // Hide restaurant menu
  await Restaurant.updateOne(
    { ownerId: user._id },
    { isPublished: false }
  );
  break;
}
```

### 3. Config Updates
```javascript
// Add to config.js
menu: {
  defaultCurrency: 'BGN',
  supportedLanguages: [
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ],
  maxCategoriesPerRestaurant: 20,
  maxProductsPerCategory: 50,
  bgnToEurRate: 1.956 // Fixed rate for Bulgarian Lev to Euro
}
```

## Development Phases

### Phase 1: Core Infrastructure (Week 1-2)
1. Create database models
2. Set up basic API routes
3. Implement authentication middleware
4. Create basic dashboard layout

### Phase 2: Restaurant & Menu Management (Week 3-4)
1. Restaurant creation and editing
2. Category management with drag-and-drop
3. Product management with image upload
4. Basic menu preview

### Phase 3: Public Menu Display (Week 5)
1. Public menu page implementation
2. Responsive design
3. SEO optimization
4. URL slug handling

### Phase 4: Translation System (Week 6)
1. Translation model implementation
2. Translation management interface
3. Multi-language menu display
4. Language switching functionality

### Phase 5: Polish & Optimization (Week 7-8)
1. Performance optimization
2. Advanced features (analytics, bulk operations)
3. Testing and bug fixes
4. Documentation and deployment

## Technical Requirements

### Environment Variables
```env
# Existing variables...

# New variables for menu platform
NEXT_PUBLIC_MENU_DOMAIN=yourdomain.com
AWS_S3_BUCKET_NAME=restaurant-images
AWS_S3_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Optional: Translation services
GOOGLE_TRANSLATE_API_KEY=your_key
DEEPL_API_KEY=your_key
```

### Dependencies to Add
```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.x.x",
    "react-beautiful-dnd": "^13.x.x",
    "react-dropzone": "^14.x.x",
    "slugify": "^1.x.x",
    "sharp": "^0.32.x",
    "react-select": "^5.x.x"
  }
}
```

## Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- 99.9% uptime for menu pages
- Image optimization achieving 70%+ size reduction
- SEO score > 90 for public menu pages

### Business Metrics
- Restaurant onboarding completion rate > 80%
- Menu update frequency (active vs inactive subscribers)
- Translation adoption rate
- Customer engagement on public menu pages

## Future Enhancements

### Short-term (Next 3 months)
1. QR code generation for restaurant tables
2. Basic analytics dashboard
3. Menu item availability toggle
4. Customer reviews and ratings

### Medium-term (Next 6 months)
1. Online ordering integration
2. Table reservation system
3. Advanced analytics with insights
4. Mobile app for restaurant management

### Long-term (Next year)
1. Multi-location restaurant support
2. Franchise management features
3. Integration with POS systems
4. AI-powered menu optimization suggestions

---

This implementation plan provides a comprehensive roadmap for building a robust digital menu platform while maintaining consistency with the existing codebase patterns and ensuring scalability for future enhancements.