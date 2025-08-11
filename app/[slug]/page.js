import { notFound } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";

import PublicMenu from "@/components/menu/PublicMenu";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    await connectMongo();
    const restaurant = await Restaurant.findOne({ slug }).populate('ownerId');
    
    if (!restaurant) {
      return {
        title: 'Restaurant Not Found',
        description: 'The requested restaurant could not be found.'
      };
    }

    return {
      title: `${restaurant.name} - Digital Menu`,
      description: restaurant.description || `View the menu for ${restaurant.name}`,
      openGraph: {
        title: `${restaurant.name} - Digital Menu`,
        description: restaurant.description || `View the menu for ${restaurant.name}`,
        images: restaurant.logoUrl ? [restaurant.logoUrl] : [],
        type: 'website',
        siteName: restaurant.name,
        locale: 'en_US',
        url: `https://${process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/${restaurant.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${restaurant.name} - Digital Menu`,
        description: restaurant.description || `View the menu for ${restaurant.name}`,
        images: restaurant.logoUrl ? [restaurant.logoUrl] : [],
      },
      robots: {
        index: restaurant.isPublished,
        follow: restaurant.isPublished
      },
      // Add structured data for better SEO
      other: {
        'application/ld+json': JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": restaurant.name,
          "description": restaurant.description || `Digital menu for ${restaurant.name}`,
          "url": `https://${process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/${restaurant.slug}`,
          ...(restaurant.logoUrl && { "image": restaurant.logoUrl }),
          ...(restaurant.priceRange && { "priceRange": restaurant.priceRange }),
          ...(restaurant.address && { "address": { "@type": "PostalAddress", "streetAddress": restaurant.address } }),
          ...(restaurant.phone && { "telephone": restaurant.phone }),
          ...(restaurant.email && { "email": restaurant.email }),
          ...(restaurant.website && { "url": restaurant.website }),
          ...(restaurant.operatingHours && {
            "openingHoursSpecification": Object.entries(restaurant.operatingHours)
              .filter(([, hours]) => !hours.closed && hours.open && hours.close)
              .map(([day, hours]) => ({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
                "opens": hours.open,
                "closes": hours.close
              }))
          })
        })
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Digital Menu',
      description: 'Restaurant digital menu'
    };
  }
}

export default async function PublicMenuPage({ params }) {
  const { slug } = params;
  
  // Default to Bulgarian - language switching will be handled client-side
  
  try {
    await connectMongo();
    
    // Fetch restaurant and check if it should be visible
    const restaurant = await Restaurant.findOne({ slug }).populate('ownerId');
    
    if (!restaurant) {
      notFound();
    }

    // Check if menu should be visible (restaurant is published and owner has access)
    if (!restaurant.isPublished || !restaurant.ownerId?.hasAccess) {
      return (
        <main className="min-h-screen bg-base-100 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Menu Not Available</h1>
            <p className="text-base-content/70">
              This restaurant menu is currently not available to the public.
            </p>
          </div>
        </main>
      );
    }

    // Fetch menu structure with better error handling
    let categories, products;
    
    try {
      categories = await Category.find({ 
        restaurantId: restaurant._id, 
        isActive: true 
      }).sort({ position: 1 });
      
      products = await MenuProduct.find({ 
        restaurantId: restaurant._id, 
        isActive: true 
      }).sort({ position: 1 });
    } catch (dbError) {
      console.error('Database error loading menu:', dbError);
      // If database error, still show restaurant but with empty menu
      categories = [];
      products = [];
    }

    // Pass raw data to client - language switching will be handled client-side
    const menuData = {
      restaurant: {
        ...JSON.parse(JSON.stringify(restaurant)),
        _id: restaurant._id.toString(),
        ownerId: restaurant.ownerId._id ? restaurant.ownerId._id.toString() : restaurant.ownerId.toString()
      },
      categories: categories.map(category => ({
        ...JSON.parse(JSON.stringify(category)),
        _id: category._id.toString(),
        restaurantId: category.restaurantId.toString(),
        products: products
          .filter(product => product.categoryId.toString() === category._id.toString())
          .map(product => ({
            ...JSON.parse(JSON.stringify(product)),
            _id: product._id.toString(),
            categoryId: product.categoryId.toString(),
            restaurantId: product.restaurantId.toString()
          }))
      })),
      currentLanguage: 'bg', // Default language
      availableLanguages: restaurant.settings?.availableLanguages || ['bg']
    };

    return <PublicMenu menuData={menuData} />;
    
  } catch (error) {
    console.error('Error loading public menu:', error);
    
    // Only trigger notFound for actual "not found" cases
    if (error.message && error.message.includes('not found')) {
      notFound();
    }
    
    // For other errors, show a generic error page
    return (
      <main className="min-h-screen bg-base-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-base-content/70 mb-4">
            There was an error loading the menu. Please try again later.
          </p>
          <a 
            href={`/${slug}`}
            className="btn btn-primary"
          >
            Try Again
          </a>
        </div>
      </main>
    );
  }
}