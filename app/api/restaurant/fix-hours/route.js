import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Restaurant from "@/models/Restaurant";

// POST /api/restaurant/fix-hours - Fix operating hours for user's restaurant
export async function POST() {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await Restaurant.findOne({ ownerId: session.user.id });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Fix operating hours with complete data
    const defaultOperatingHours = {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "22:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: true },
      sunday: { open: "09:00", close: "22:00", closed: true }
    };

    const fixedOperatingHours = {};
    Object.keys(defaultOperatingHours).forEach(day => {
      const existingHours = restaurant.operatingHours?.[day] || {};
      fixedOperatingHours[day] = {
        open: existingHours.open || defaultOperatingHours[day].open,
        close: existingHours.close || defaultOperatingHours[day].close,
        closed: existingHours.closed !== undefined ? existingHours.closed : defaultOperatingHours[day].closed
      };
    });

    restaurant.operatingHours = fixedOperatingHours;
    await restaurant.save();

    console.log("Fixed operating hours:", fixedOperatingHours);

    return NextResponse.json({ 
      message: "Operating hours fixed successfully",
      operatingHours: fixedOperatingHours
    });
  } catch (error) {
    console.error("Error fixing operating hours:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}