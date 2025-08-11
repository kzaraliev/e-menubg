import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Restaurant from "@/models/Restaurant";
import User from "@/models/User";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";
import Translation from "@/models/Translation";

// GET /api/restaurant - Get user's restaurant
export async function GET() {
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

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/restaurant - Create restaurant (requires active subscription)
export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    
    if (!user?.hasAccess) {
      return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
    }

    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ ownerId: session.user.id });
    if (existingRestaurant) {
      return NextResponse.json({ error: "User already has a restaurant" }, { status: 400 });
    }

    const body = await req.json();
    console.log("API received POST body:", body); // Debug logging
    console.log("Operating hours in POST:", body.operatingHours); // Debug logging
    
    const { name, slug, address, email, phone, website, description, priceRange, logoUrl, coverImageUrl, operatingHours, settings } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    // Check if slug is unique
    const existingSlug = await Restaurant.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // Ensure operating hours have complete data
    const defaultOperatingHours = {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "22:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: true },
      sunday: { open: "09:00", close: "22:00", closed: true }
    };

    const completeOperatingHours = {};
    Object.keys(defaultOperatingHours).forEach(day => {
      completeOperatingHours[day] = {
        ...defaultOperatingHours[day],
        ...(operatingHours && operatingHours[day] ? operatingHours[day] : {})
      };
    });

    console.log("Complete operating hours:", completeOperatingHours); // Debug logging

    const restaurant = new Restaurant({
      name,
      slug: slug.toLowerCase(),
      address,
      email,
      phone,
      website,
      description,
      priceRange,
      logoUrl,
      coverImageUrl,
      operatingHours: completeOperatingHours,
      settings,
      ownerId: session.user.id,
      isPublished: user.hasAccess, // Auto-publish if user has active subscription
    });

    await restaurant.save();

    // Update user's restaurant reference
    await User.findByIdAndUpdate(session.user.id, { 
      restaurantId: restaurant._id,
      lastMenuUpdate: new Date()
    });

    // Serialize ObjectIds to strings for frontend use
    const serializedRestaurant = {
      ...JSON.parse(JSON.stringify(restaurant)),
      _id: restaurant._id.toString(),
      ownerId: restaurant.ownerId.toString()
    };

    return NextResponse.json(serializedRestaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/restaurant - Update restaurant
export async function PUT(req) {
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

    const body = await req.json();
    console.log("API received body:", body); // Debug logging
    console.log("Operating hours received:", body.operatingHours); // Debug logging
    
    const { name, slug, address, email, phone, website, description, priceRange, logoUrl, coverImageUrl, operatingHours, settings } = body;

    // If slug is being changed, check uniqueness
    if (slug && slug !== restaurant.slug) {
      const existingSlug = await Restaurant.findOne({ slug, _id: { $ne: restaurant._id } });
      if (existingSlug) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
      restaurant.slug = slug.toLowerCase();
    }

    // Update fields
    if (name) restaurant.name = name;
    if (address !== undefined) restaurant.address = address;
    if (email !== undefined) restaurant.email = email;
    if (phone !== undefined) restaurant.phone = phone;
    if (website !== undefined) restaurant.website = website;
    if (description !== undefined) restaurant.description = description;
    if (priceRange) restaurant.priceRange = priceRange;
    if (logoUrl !== undefined) restaurant.logoUrl = logoUrl;
    if (coverImageUrl !== undefined) restaurant.coverImageUrl = coverImageUrl;
    
    // Handle operating hours with complete data
    if (operatingHours) {
      const defaultOperatingHours = {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "22:00", closed: false },
        saturday: { open: "09:00", close: "22:00", closed: true },
        sunday: { open: "09:00", close: "22:00", closed: true }
      };

      const completeOperatingHours = {};
      Object.keys(defaultOperatingHours).forEach(day => {
        completeOperatingHours[day] = {
          ...defaultOperatingHours[day],
          ...(operatingHours[day] ? operatingHours[day] : {})
        };
      });

      console.log("Updated operating hours:", completeOperatingHours); // Debug logging
      restaurant.operatingHours = completeOperatingHours;
    }
    
    if (settings) restaurant.settings = { ...restaurant.settings, ...settings };

    await restaurant.save();

    // Update user's last menu update
    await User.findByIdAndUpdate(session.user.id, { lastMenuUpdate: new Date() });

    // Serialize ObjectIds to strings for frontend use
    const serializedRestaurant = {
      ...JSON.parse(JSON.stringify(restaurant)),
      _id: restaurant._id.toString(),
      ownerId: restaurant.ownerId.toString()
    };

    return NextResponse.json(serializedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/restaurant - Delete restaurant (cascade delete categories/products)
export async function DELETE() {
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

    // Cascade delete all associated data
    console.log(`Starting cascade deletion for restaurant ${restaurant._id}`);
    
    // 1. Delete all translations for this restaurant
    const deletedTranslations = await Translation.deleteMany({ 
      restaurantId: restaurant._id 
    });
    console.log(`Deleted ${deletedTranslations.deletedCount} translations`);
    
    // 2. Delete all products for this restaurant
    const deletedProducts = await MenuProduct.deleteMany({ 
      restaurantId: restaurant._id 
    });
    console.log(`Deleted ${deletedProducts.deletedCount} products`);
    
    // 3. Delete all categories for this restaurant
    const deletedCategories = await Category.deleteMany({ 
      restaurantId: restaurant._id 
    });
    console.log(`Deleted ${deletedCategories.deletedCount} categories`);
    
    // 4. Finally, delete the restaurant itself
    await Restaurant.findByIdAndDelete(restaurant._id);
    console.log(`Deleted restaurant ${restaurant._id}`);

    // Update user's restaurant reference
    await User.findByIdAndUpdate(session.user.id, { 
      restaurantId: null,
      lastMenuUpdate: new Date()
    });

    return NextResponse.json({ 
      message: "Restaurant and all associated data deleted successfully",
      deletedData: {
        translations: deletedTranslations.deletedCount,
        products: deletedProducts.deletedCount,
        categories: deletedCategories.deletedCount
      }
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}