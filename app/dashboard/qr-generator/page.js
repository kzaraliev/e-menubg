import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import QRCodeGenerator from "./components/QRCodeGenerator";

export default async function QRGeneratorPage() {
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
              QR Code генератор
            </h1>
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Нуждае се активен абонамент за генериране на QR кодове.</span>
            </div>
            <a href="/#pricing" className="btn btn-primary mt-4">
              Вижте ценовите планове
            </a>
          </div>
        </section>
      </main>
    );
  }

  // Fetch user's restaurants
  const restaurants = await Restaurant.find({ ownerId: session.user.id, isActive: true })
    .sort({ createdAt: -1 });

  // Serialize restaurants for client
  const serializedRestaurants = restaurants.map(restaurant => ({
    ...JSON.parse(JSON.stringify(restaurant)),
    _id: restaurant._id.toString()
  }));

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            🔗 QR Code генератор
          </h1>
          <p className="text-base-content/70 mt-2">
            Създайте QR кодове за менютата на вашите ресторанти или WiFi настройки
          </p>
        </div>

        {/* QR Generator Component */}
        <QRCodeGenerator restaurants={serializedRestaurants} />
      </section>
    </main>
  );
}