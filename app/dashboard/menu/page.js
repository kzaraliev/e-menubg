import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";
import MenuManager from "@/components/dashboard/MenuManager";
import Link from "next/link";

export default async function MenuPage() {
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
              Управление на менюто
            </h1>
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Нуждает се активен абонамент за управление на менюта.</span>
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
              Управление на менюто
            </h1>
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Нуждаете се първо да създадете ресторант, преди да управлявате менюто си.</span>
            </div>
            <Link href="/dashboard/restaurant" className="btn btn-primary mt-4">
              Създайте ресторант
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Fetch existing categories and products
  const categories = await Category.find({ restaurantId: restaurant._id })
    .sort({ position: 1 });
  
  const products = await MenuProduct.find({ restaurantId: restaurant._id })
    .sort({ position: 1 });

  // Serialize categories with proper _id conversion
  const serializedCategories = categories.map(cat => ({
    ...JSON.parse(JSON.stringify(cat)),
    _id: cat._id.toString()
  }));

  // Serialize products with proper _id conversion
  const serializedProducts = products.map(prod => ({
    ...JSON.parse(JSON.stringify(prod)),
    _id: prod._id.toString(),
    categoryId: prod.categoryId.toString(),
    restaurantId: prod.restaurantId.toString()
  }));

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Управление на менюто
            </h1>
            <p className="text-base-content/70 mt-2">
              Управлявайте категории и елементи от менюто за {restaurant.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge badge-lg">
              {restaurant.isPublished ? "Публикуван" : "Чернова"}
            </div>
            <Link 
              href={`/${restaurant.slug}`} 
              target="_blank"
              className="btn btn-outline btn-sm"
            >
              Вижте публичното меню
            </Link>
          </div>
        </div>
        
        <MenuManager 
          restaurant={{
            ...JSON.parse(JSON.stringify(restaurant)),
            _id: restaurant._id.toString()
          }}
          initialCategories={serializedCategories}
          initialProducts={serializedProducts}
        />
      </section>
    </main>
  );
}