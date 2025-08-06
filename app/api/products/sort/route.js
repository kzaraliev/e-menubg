import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import MenuProduct from "@/models/MenuProduct";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";

// PUT /api/products/sort - Update product sort order within a category
export async function PUT(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { categoryId, productIds } = body;

    // Validate required fields
    if (!categoryId || !Array.isArray(productIds)) {
      return NextResponse.json({ 
        error: "Category ID and product IDs array are required" 
      }, { status: 400 });
    }

    // Verify category exists and get restaurant info
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: category.restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    // Verify all products belong to this category
    const products = await MenuProduct.find({ 
      _id: { $in: productIds },
      categoryId 
    });
    
    if (products.length !== productIds.length) {
      return NextResponse.json({ 
        error: "Some products not found or don't belong to this category" 
      }, { status: 400 });
    }

    // Update positions based on array order
    const updatePromises = productIds.map((productId, index) => 
      MenuProduct.findByIdAndUpdate(productId, { position: index }, { new: true })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: "Product order updated successfully",
      updatedCount: productIds.length 
    });
    
  } catch (error) {
    console.error("Error updating product sort order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}