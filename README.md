# E-Menu - Digital Menu Platform

A comprehensive digital menu platform built with Next.js that allows restaurant owners to create, manage, and publish beautiful digital menus with multi-language support.

## Features

### Core Features
- **Restaurant Management**: Create and manage restaurant profiles with contact information, operating hours, and settings
- **Menu Builder**: Visual interface for creating categories and adding menu items
- **Multi-Currency Support**: Display prices in both BGN and EUR with automatic conversion
- **Public Menu Display**: Beautiful, responsive menus accessible via custom URLs
- **Subscription Management**: Integrated with Stripe for subscription billing
- **SEO Optimized**: Dynamic meta tags and structured data for better search visibility

### Menu Management
- **Category Organization**: Organize menu items into categories with custom icons
- **Product Details**: Rich product information including descriptions, allergens, dietary indicators
- **Image Support**: Upload and display images for restaurants, categories, and products
- **Availability Control**: Mark items as available/unavailable or active/inactive
- **Pricing Management**: Easy price management with dual currency display

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Search Functionality**: Customers can search through menu items
- **Category Navigation**: Easy navigation between menu categories
- **Dietary Indicators**: Clear labeling for vegetarian, vegan, spicy items
- **Operating Hours**: Display current status and opening hours

### Technical Features
- **Next.js 14**: Latest Next.js with App Router
- **MongoDB**: Scalable database with Mongoose ODM
- **Authentication**: NextAuth.js for secure user authentication
- **Payments**: Stripe integration for subscription management
- **Styling**: TailwindCSS with DaisyUI components
- **Type Safety**: JavaScript with comprehensive validation

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emenu-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # Stripe
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   
   # Google OAuth (optional)
   GOOGLE_ID=your_google_oauth_id
   GOOGLE_SECRET=your_google_oauth_secret
   
   # Optional: Image storage
   AWS_S3_BUCKET_NAME=your_s3_bucket
   AWS_S3_REGION=eu-central-1
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Restaurant Owners

1. **Sign up and Subscribe**
   - Create an account on the platform
   - Subscribe to a plan to activate menu management features

2. **Create Your Restaurant**
   - Go to Dashboard → Restaurant Settings
   - Fill in your restaurant information (name, address, contact details)
   - Set up operating hours and preferences
   - Choose a unique URL slug for your menu

3. **Build Your Menu**
   - Navigate to Dashboard → Menu Management
   - Create categories (e.g., Appetizers, Main Courses, Desserts)
   - Add products to each category with descriptions, prices, and images
   - Mark dietary preferences and allergens

4. **Publish Your Menu**
   - Your menu is automatically published when you have an active subscription
   - Share your menu URL with customers: `yourdomain.com/your-restaurant-slug`

### For Customers

1. **Access the Menu**
   - Visit the restaurant's menu URL
   - No registration required for viewing menus

2. **Browse the Menu**
   - Use category navigation to browse different sections
   - Search for specific items
   - View detailed product information including allergens and dietary info

3. **Contact the Restaurant**
   - Find contact information in the footer
   - Call directly or visit the restaurant's website

## API Routes

### Restaurant Management
- `POST /api/restaurant` - Create restaurant
- `GET /api/restaurant` - Get user's restaurant
- `PUT /api/restaurant` - Update restaurant
- `DELETE /api/restaurant` - Delete restaurant

### Category Management
- `POST /api/categories` - Create category
- `GET /api/categories?restaurantId=xxx` - List categories
- `PUT /api/categories/[categoryId]` - Update category
- `DELETE /api/categories/[categoryId]` - Delete category

### Product Management
- `POST /api/products` - Create product
- `GET /api/products?categoryId=xxx` - List products
- `PUT /api/products/[productId]` - Update product
- `DELETE /api/products/[productId]` - Delete product

## Database Schema

### Restaurant
- Basic information (name, slug, description)
- Contact details (address, phone, email, website)
- Operating hours for each day
- Settings (currency display, languages)
- Ownership and publication status

### Category
- Name and description
- Position for ordering
- Icon and image customization
- Restaurant association

### MenuProduct
- Product details (name, description, price)
- Organization (category, position)
- Dietary information (vegetarian, vegan, spicy)
- Availability and status

### User (Extended)
- Authentication information
- Subscription status
- Restaurant association

## Customization

### Styling
The application uses TailwindCSS with DaisyUI components. Customize the theme in `config.js`:

```javascript
colors: {
  theme: "light", // or "dark" or custom theme
  main: themes["light"]["primary"],
}
```

### Currency Configuration
Modify currency settings in `config.js`:

```javascript
menu: {
  defaultCurrency: 'BGN',
  bgnToEurRate: 1.956, // Update with current rate
}
```

### Supported Languages
Add or modify languages in `config.js`:

```javascript
menu: {
  supportedLanguages: [
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    // Add more languages
  ]
}
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically with git pushes

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support, please contact [support@resend.e-menu.bg](mailto:support@resend.e-menu.bg)

## License

This project is proprietary software. All rights reserved.