import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";

// PUT /api/categories/sort - Update category sort order
export async function PUT(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurantId, categoryIds } = body;

    // Validate required fields
    if (!restaurantId || !Array.isArray(categoryIds)) {
      return NextResponse.json({ 
        error: "Restaurant ID and category IDs array are required" 
      }, { status: 400 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    // Verify all categories belong to this restaurant
    const categories = await Category.find({ 
      _id: { $in: categoryIds },
      restaurantId 
    });
    
    if (categories.length !== categoryIds.length) {
      return NextResponse.json({ 
        error: "Some categories not found or don't belong to this restaurant" 
      }, { status: 400 });
    }

    // Update positions based on array order
    const updatePromises = categoryIds.map((categoryId, index) => 
      Category.findByIdAndUpdate(categoryId, { position: index }, { new: true })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: "Category order updated successfully",
      updatedCount: categoryIds.length 
    });
    
  } catch (error) {
    console.error("Error updating category sort order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}