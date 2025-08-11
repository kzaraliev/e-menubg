import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import connectMongo from "@/libs/mongoose";
import Restaurant from "@/models/Restaurant";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// SEO metadata
export const metadata = {
  title: "Ресторанти с дигитални менюта | E-Menu.bg",
  description: "Открийте всички ресторанти в България, които използват дигитални менюта. Разгледайте менютата им онлайн с QR кодове и AI асистент.",
  openGraph: {
    title: "Ресторанти с дигитални менюта | E-Menu.bg",
    description: "Открийте всички ресторанти в България, които използват дигитални менюта. Разгледайте менютата им онлайн с QR кодове и AI асистент.",
    type: "website",
    url: "https://www.e-menu.bg/restaurants",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Simple restaurant item component
function RestaurantItem({ restaurant }) {
  return (
    <div className="bg-base-100 border border-base-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {restaurant.logoUrl && (
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={restaurant.logoUrl}
                  alt={`${restaurant.name} logo`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base">{restaurant.name}</h3>
            {restaurant.address && (
              <p className="text-sm text-base-content/60 truncate">{restaurant.address}</p>
            )}
          </div>
        </div>
        <Link 
          href={`/${restaurant.slug}`}
          className="btn btn-primary btn-sm"
        >
          Виж меню
        </Link>
      </div>
    </div>
  );
}

// Loading component
function RestaurantSkeleton() {
  return (
    <div className="bg-base-100 border border-base-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-base-200"></div>
          <div className="space-y-2">
            <div className="h-4 bg-base-200 rounded w-32"></div>
            <div className="h-3 bg-base-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-8 bg-base-200 rounded w-20"></div>
      </div>
    </div>
  );
}

// Pagination component
function PaginationComponent({ currentPage, totalPages, totalItems }) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-200">
      {/* Results info */}
      <div className="text-sm text-base-content/60">
        Показани {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalItems)} от {totalItems} ресторанта
      </div>
      
      {/* Pagination buttons */}
      <div className="join">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link href={`?page=${currentPage - 1}`} className="join-item btn btn-sm">
            ←
          </Link>
        ) : (
          <button className="join-item btn btn-sm btn-disabled">←</button>
        )}
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="join-item btn btn-sm btn-disabled">...</span>
          ) : (
            <Link 
              key={page} 
              href={`?page=${page}`}
              className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
            >
              {page}
            </Link>
          )
        ))}
        
        {/* Next button */}
        {currentPage < totalPages ? (
          <Link href={`?page=${currentPage + 1}`} className="join-item btn btn-sm">
            →
          </Link>
        ) : (
          <button className="join-item btn btn-sm btn-disabled">→</button>
        )}
      </div>
    </div>
  );
}

// Main restaurant list component
async function RestaurantList({ page = 1 }) {
  try {
    await connectMongo();
    
    const ITEMS_PER_PAGE = 20;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    // Get total count for pagination
    const totalRestaurants = await Restaurant.countDocuments({
      isActive: true,
      isPublished: true
    });
    
    // Get published restaurants for current page
    const restaurants = await Restaurant.find({
      isActive: true,
      isPublished: true
    })
    .select('name slug address logoUrl')
    .sort({ name: 1 }) // Alphabetical order for better SEO
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .lean();
    
    const totalPages = Math.ceil(totalRestaurants / ITEMS_PER_PAGE);

    if (!restaurants || restaurants.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-base-content/30" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Няма налични ресторанти</h3>
          <p className="text-base-content/60">
            В момента няма публикувани ресторанти с дигитални менюта.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Restaurant List */}
        <div className="space-y-3">
          {restaurants.map((restaurant) => (
            <RestaurantItem key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationComponent 
            currentPage={page} 
            totalPages={totalPages} 
            totalItems={totalRestaurants}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading restaurants:", error);
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-error" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Грешка при зареждането</h3>
        <p className="text-base-content/60">
          Възникна грешка при зареждането на ресторантите. Моля, опитайте отново.
        </p>
      </div>
    );
  }
}

export default function RestaurantsPage({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      
      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Ресторанти с дигитални менюта
              </h1>
              <p className="text-xl text-base-content/70 mb-8">
                Открийте всички ресторанти в България, които използват дигитални менюта. 
                Разгледайте техните менюта онлайн с QR кодове и AI асистент.
              </p>
              <div className="stats stats-horizontal shadow-lg bg-base-100">
                <div className="stat">
                  <div className="stat-title">Дигитални менюта</div>
                  <div className="stat-value text-primary">100%</div>
                  <div className="stat-desc">Модерни решения</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Многоезични</div>
                  <div className="stat-value text-secondary">4</div>
                  <div className="stat-desc">Езика поддръжка</div>
                </div>
                <div className="stat">
                  <div className="stat-title">QR кодове</div>
                  <div className="stat-value text-accent">∞</div>
                  <div className="stat-desc">За всяка маса</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant List */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Suspense fallback={
              <div className="space-y-6">
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <RestaurantSkeleton key={i} />
                  ))}
                </div>
                <div className="flex justify-center">
                  <div className="h-10 bg-base-200 rounded w-64 animate-pulse"></div>
                </div>
              </div>
            }>
              <RestaurantList page={page} />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-content py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Искате и вие дигитално меню?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Присъединете се към хилядите ресторанти, които вече използват E-Menu.bg
            </p>
            <Link href="/" className="btn btn-secondary btn-lg">
              Започнете сега
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
