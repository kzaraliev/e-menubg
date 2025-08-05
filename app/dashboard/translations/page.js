import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";
import Translation from "@/models/Translation";
import TranslationManager from "@/components/dashboard/TranslationManager";
import Link from "next/link";

export default async function TranslationsPage() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  // Check if user has access
  if (!user.hasAccess) {
    return (
      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Управление на преводите
            </h1>
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Нуждает се активен абонамент за управление на преводите.</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Check if user has a restaurant
  const restaurant = await Restaurant.findOne({ ownerId: session.user.id });
  
  if (!restaurant) {
    return (
      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Управление на преводите
            </h1>
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Нуждаете се първо да създадете ресторант, преди да управлявате преводите.</span>
            </div>
            <Link href="/dashboard/restaurant" className="btn btn-primary mt-4">
              Създайте ресторант
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Fetch menu data for translation
  const categories = await Category.find({ restaurantId: restaurant._id, isActive: true })
    .sort({ position: 1 });
  
  const products = await MenuProduct.find({ restaurantId: restaurant._id, isActive: true })
    .sort({ position: 1 });

  // Fetch existing translations
  const translations = await Translation.find({ restaurantId: restaurant._id })
    .sort({ language: 1, entityType: 1, entityId: 1, field: 1 });

  // Serialize data for client
  const serializedData = {
    restaurant: {
      ...JSON.parse(JSON.stringify(restaurant)),
      _id: restaurant._id.toString()
    },
    categories: categories.map(cat => ({
      ...JSON.parse(JSON.stringify(cat)),
      _id: cat._id.toString(),
      restaurantId: cat.restaurantId.toString()
    })),
    products: products.map(prod => ({
      ...JSON.parse(JSON.stringify(prod)),
      _id: prod._id.toString(),
      categoryId: prod.categoryId.toString(),
      restaurantId: prod.restaurantId.toString()
    })),
    translations: translations.map(trans => ({
      ...JSON.parse(JSON.stringify(trans)),
      _id: trans._id.toString(),
      entityId: trans.entityId.toString(),
      restaurantId: trans.restaurantId.toString()
    }))
  };

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Управление на преводите
            </h1>
            <p className="text-base-content/70 mt-2">
              Управлявайте многоезични преводи за {restaurant.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href={`/${restaurant.slug}`} 
              target="_blank"
              className="btn btn-outline btn-sm"
            >
              Вижте публичното меню
            </Link>
          </div>
        </div>
        
        <TranslationManager 
          data={serializedData}
        />
      </section>
    </main>
  );
}