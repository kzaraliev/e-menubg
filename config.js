import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "E-Menu",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Create beautiful digital menus for your restaurant with multi-language support and easy management.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "e-menu.bg",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1RsNEOHWilXYbGmnTE0WN3wq"
            : "price_1RsNEOHWilXYbGmnTE0WN3wq",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for small projects",
        // The price you want to display, the one user will be charged on Stripe.
        price: 5.99,
        // Euro price for display
        priceEuro: 3.06,
        // Add interval for subscriptions (e.g., "month", "year")
        interval: "месец",
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1RsNEOHWilXYbGmnGSXsXeH1"
            : "price_1RsNEOHWilXYbGmnGSXsXeH1",
        name: "Advanced",
        description: "You need more power",
        price: 59.99,
        // Euro price for display
        priceEuro: 30.61,
        // Add interval for subscriptions (e.g., "month", "year")
        interval: "година",
        priceAnchor: 71.88,
        priceAnchorEuro: 36.72,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `E-menu <noreply@resend.e-menu.bg>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `E-menu <kzaraliev@resend.e-menu.bg>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@resend.e-menu.bg",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
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
    bgnToEurRate: 1.956, // Fixed rate for Bulgarian Lev to Euro
    
    // Price ranges
    priceRanges: ['$', '$$', '$$$', '$$$$'],
    
    // Common allergens
    allergens: [
      'gluten',
      'dairy', 
      'nuts',
      'eggs',
      'soy',
      'fish',
      'shellfish',
      'sesame'
    ],
    
    // Category icons
    categoryIcons: {
      'utensils': '🍽️',
      'coffee': '☕',
      'pizza': '🍕',
      'wine': '🍷',
      'dessert': '🍰',
      'salad': '🥗',
      'burger': '🍔',
      'pasta': '🍝',
      'fish': '🐟',
      'meat': '🥩',
      'vegetarian': '🥬',
      'soup': '🍲',
      'bread': '🍞',
      'breakfast': '🍳',
      'cocktail': '🍸',
      'beer': '🍺'
    },
    
    // Default operating hours structure
    defaultOperatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: true },
      sunday: { open: '10:00', close: '21:00', closed: true }
    },
    
    // Days of week
    daysOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  }
};

export default config;
