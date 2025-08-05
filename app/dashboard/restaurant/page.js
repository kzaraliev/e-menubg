import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import RestaurantManager from "@/components/dashboard/RestaurantManager";

export default async function RestaurantPage() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  // Check if user has access
  if (!user.hasAccess) {
    return (
      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Restaurant Management
            </h1>
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Active subscription required to create and manage restaurants.</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Fetch existing restaurant if any
  let restaurant = null;
  try {
    restaurant = await Restaurant.findOne({ ownerId: session.user.id });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Restaurant Management
          </h1>
          {restaurant && (
            <div className="badge badge-lg">
              {restaurant.isPublished ? "Published" : "Draft"}
            </div>
          )}
        </div>
        
        <RestaurantManager 
          initialRestaurant={restaurant ? JSON.parse(JSON.stringify(restaurant)) : null}
          userId={session.user.id}
        />
      </section>
    </main>
  );
}