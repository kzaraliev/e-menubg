import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";
import MenuProduct from "@/models/MenuProduct";

// GET /api/categories?restaurantId=xxx - List categories for a restaurant
export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    
    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
    }

    const categories = await Category.find({ 
      restaurantId, 
      isActive: true 
    }).sort({ position: 1 });

    // Serialize ObjectIds to strings for frontend use
    const serializedCategories = categories.map(category => ({
      ...JSON.parse(JSON.stringify(category)),
      _id: category._id.toString(),
      restaurantId: category.restaurantId.toString()
    }));

    return NextResponse.json(serializedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/categories - Create category
export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received body:", body); // Debug logging
    const { name, description, restaurantId, imageUrl, iconName } = body;

    // Validate required fields
    if (!name || !restaurantId) {
      console.log("Validation failed - Name:", name, "Restaurant ID:", restaurantId); // Debug logging
      return NextResponse.json({ error: "Name and restaurant ID are required" }, { status: 400 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    // Get the next position
    const lastCategory = await Category.findOne({ restaurantId })
      .sort({ position: -1 });
    const position = lastCategory ? lastCategory.position + 1 : 0;

    const category = new Category({
      name,
      description,
      restaurantId,
      position,
      imageUrl,
      iconName
    });

    await category.save();
    
    // Serialize ObjectIds to strings for frontend use
    const serializedCategory = {
      ...JSON.parse(JSON.stringify(category)),
      _id: category._id.toString(),
      restaurantId: category.restaurantId.toString()
    };
    
    return NextResponse.json(serializedCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}