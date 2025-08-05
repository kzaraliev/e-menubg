import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import MenuProduct from "@/models/MenuProduct";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";

// GET /api/products?categoryId=xxx - List products in a category
export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const restaurantId = searchParams.get('restaurantId');
    
    if (!categoryId && !restaurantId) {
      return NextResponse.json({ error: "Category ID or Restaurant ID is required" }, { status: 400 });
    }

    let query = { isActive: true };
    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    const products = await MenuProduct.find(query).sort({ position: 1 });
    
    // Serialize ObjectIds to strings for frontend use
    const serializedProducts = products.map(product => ({
      ...JSON.parse(JSON.stringify(product)),
      _id: product._id.toString(),
      categoryId: product.categoryId.toString(),
      restaurantId: product.restaurantId.toString()
    }));
    
    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/products - Create menu product
export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received product body:", body); // Debug logging
    
    const { 
      name, 
      description, 
      priceBGN, 
      categoryId, 
      restaurantId,
      imageUrl, 
      size, 
      allergens, 
      isVegetarian, 
      isVegan, 
      isSpicy, 
      isPopular,
      preparationTime
    } = body;

    // Validate required fields
    if (!name || !priceBGN || !categoryId || !restaurantId) {
      console.log("Product validation failed - Name:", name, "Price:", priceBGN, "Category ID:", categoryId, "Restaurant ID:", restaurantId); // Debug logging
      return NextResponse.json({ 
        error: "Name, price, category ID, and restaurant ID are required" 
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

    // Verify category belongs to the restaurant
    const category = await Category.findOne({ 
      _id: categoryId, 
      restaurantId 
    });
    
    if (!category) {
      return NextResponse.json({ error: "Category not found in this restaurant" }, { status: 404 });
    }

    // Get the next position
    const lastProduct = await MenuProduct.findOne({ categoryId })
      .sort({ position: -1 });
    const position = lastProduct ? lastProduct.position + 1 : 0;

    const product = new MenuProduct({
      name,
      description,
      priceBGN: Number(priceBGN),
      categoryId,
      restaurantId,
      position,
      imageUrl,
      size,
      allergens: allergens || [],
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isSpicy: isSpicy || false,
      isPopular: isPopular || false,
      preparationTime
    });

    await product.save();
    
    // Serialize ObjectIds to strings for frontend use
    const serializedProduct = {
      ...JSON.parse(JSON.stringify(product)),
      _id: product._id.toString(),
      categoryId: product.categoryId.toString(),
      restaurantId: product.restaurantId.toString()
    };
    
    return NextResponse.json(serializedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}