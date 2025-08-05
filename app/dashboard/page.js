import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";
import Link from "next/link";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  // Debug logging to see what user data we actually get
  console.log("User data from database:", JSON.stringify(user, null, 2));

  // Fetch restaurant data if user has access
  let restaurant = null;
  let stats = { categories: 0, products: 0 };

  if (user.hasAccess) {
    try {
      restaurant = await Restaurant.findOne({ ownerId: session.user.id });
      if (restaurant) {
        stats.categories = await Category.countDocuments({
          restaurantId: restaurant._id,
        });
        stats.products = await MenuProduct.countDocuments({
          restaurantId: restaurant._id,
        });
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  }

  return (
    <>
      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Контролен панел
          </h1>
            <p className="text-lg">Добре дошли отново, {user.name}! 👋</p>
          </div>

          {/* Subscription Status */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Статус на абонамента</h2>
              <div className="flex items-center gap-4">
                <div
                  className={`badge badge-lg ${
                    user.hasAccess ? "badge-success" : "badge-error"
                  }`}
                >
                  {user.hasAccess ? "Активен" : "Неактивен"}
                </div>
                <span className="text-base-content/70">
                  {user.hasAccess
                    ? "Вашият абонамент е активен"
                    : "Нуждаете се от активен абонамент, за да създадете ресторанти"}
                </span>
              </div>
              {!user.hasAccess && (
                <div className="card-actions">
                  <Link href="/#pricing" className="btn btn-primary">
                    Вижте ценовите планове
                  </Link>
                </div>
              )}
            </div>
          </div>

          {user.hasAccess && (
            <>
              {/* Restaurant Overview */}
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">Преглед на ресторанта</h2>

                  {restaurant ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {restaurant.name}
                          </h3>
                                                     <p className="text-base-content/70">
                             Ресторант с дигитално меню
                           </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`badge ${
                                restaurant.isPublished
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {restaurant.isPublished ? "Публикуван" : "Чернова"}
                            </span>
                            <span className="badge badge-outline">
                              {restaurant.priceRange}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/${restaurant.slug}`}
                          target="_blank"
                          className="btn btn-outline btn-sm"
                        >
                          Вижте публичното меню
                        </Link>
                      </div>

                      <div className="stats shadow w-full">
                        <div className="stat">
                          <div className="stat-title">Категории</div>
                          <div className="stat-value text-2xl">
                            {stats.categories}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Продукти</div>
                          <div className="stat-value text-2xl">
                            {stats.products}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Последно обновен</div>
                          <div className="stat-value text-lg">
                            {new Date(
                              restaurant.updatedAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-base-content/50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Все още няма ресторант
                      </h3>
                      <p className="text-base-content/70 mb-4">
                        Създайте своя ресторант, за да започнете изграждането на вашето
                        дигитално меню.
                      </p>
                      <Link
                        href="/dashboard/restaurant"
                        className="btn btn-primary"
                      >
                        Създайте ресторант
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow h-48">
                  <div className="card-body flex flex-col justify-between text-center p-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                          />
                        </svg>
                      </div>
                      <h3 className="card-title text-base font-semibold mb-2">Ресторант</h3>
                      <p className="text-xs text-base-content/70 mb-3">
                        Настройки и информация
                      </p>
                    </div>
                    <div className="card-actions justify-center">
                      <Link
                        href="/dashboard/restaurant"
                        className="btn btn-primary btn-sm w-full"
                      >
                        Управление
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow h-48">
                  <div className="card-body flex flex-col justify-between text-center p-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <h3 className="card-title text-base font-semibold mb-2">Меню</h3>
                      <p className="text-xs text-base-content/70 mb-3">
                        Категории и продукти
                      </p>
                    </div>
                    <div className="card-actions justify-center">
                      <Link
                        href="/dashboard/menu"
                        className="btn btn-secondary btn-sm w-full"
                      >
                        Управление
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow h-48">
                  <div className="card-body flex flex-col justify-between text-center p-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                          />
                        </svg>
                      </div>
                      <h3 className="card-title text-base font-semibold mb-2">Преводи</h3>
                      <p className="text-xs text-base-content/70 mb-3">
                        Многоезично меню
                      </p>
                    </div>
                    <div className="card-actions justify-center">
                      <Link
                        href="/dashboard/translations"
                        className="btn btn-accent btn-sm w-full"
                      >
                        Управление
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow h-48">
                  <div className="card-body flex flex-col justify-between text-center p-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-3 bg-info/10 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-info"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg>
                      </div>
                      <h3 className="card-title text-base font-semibold mb-2">QR кодове</h3>
                      <p className="text-xs text-base-content/70 mb-3">
                        Генерирай за менюто
                      </p>
                    </div>
                    <div className="card-actions justify-center">
                      <Link 
                        href="/dashboard/qr-generator"
                        className="btn btn-info btn-sm w-full"
                      >
                        Създай
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Account Information */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Информация за акаунта</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Имейл:</span>
                  <span>{user.email}</span>
                </div>
                {user.priceId && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">План:</span>
                    <span className="badge badge-primary">Премиум</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
