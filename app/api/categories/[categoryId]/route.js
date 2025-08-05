import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";
import Restaurant from "@/models/Restaurant";

// GET /api/categories/[categoryId] - Get category details
export async function GET(req, { params }) {
  try {
    await connectMongo();
    const { categoryId } = params;

    const category = await Category.findById(categoryId);
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/categories/[categoryId] - Update category
export async function PUT(req, { params }) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    const { categoryId } = params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, imageUrl, iconName, isActive } = body;

    // Update fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (imageUrl !== undefined) category.imageUrl = imageUrl;
    if (iconName !== undefined) category.iconName = iconName;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    
    // Serialize ObjectIds to strings for frontend use
    const serializedCategory = {
      ...JSON.parse(JSON.stringify(category)),
      _id: category._id.toString(),
      restaurantId: category.restaurantId.toString()
    };
    
    return NextResponse.json(serializedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/categories/[categoryId] - Delete category (cascade delete products)
export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    const { categoryId } = params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete all products in this category
    await MenuProduct.deleteMany({ categoryId });

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    return NextResponse.json({ message: "Category and all products deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}