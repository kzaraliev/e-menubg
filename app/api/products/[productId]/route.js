import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import MenuProduct from "@/models/MenuProduct";
import Restaurant from "@/models/Restaurant";

// GET /api/products/[productId] - Get product details
export async function GET(req, { params }) {
  try {
    await connectMongo();
    const { productId } = params;

    const product = await MenuProduct.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/products/[productId] - Update product
export async function PUT(req, { params }) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    const { productId } = params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await MenuProduct.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: product.restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { 
      name, 
      description, 
      priceBGN, 
      imageUrl, 
      size, 
      allergens, 
      isVegetarian, 
      isVegan, 
      isSpicy, 
      isPopular,
      isActive,
      isAvailable,
      preparationTime
    } = body;

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (priceBGN !== undefined) product.priceBGN = Number(priceBGN);
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (size !== undefined) product.size = size;
    if (allergens !== undefined) product.allergens = allergens;
    if (isVegetarian !== undefined) product.isVegetarian = isVegetarian;
    if (isVegan !== undefined) product.isVegan = isVegan;
    if (isSpicy !== undefined) product.isSpicy = isSpicy;
    if (isPopular !== undefined) product.isPopular = isPopular;
    if (isActive !== undefined) product.isActive = isActive;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;
    if (preparationTime !== undefined) product.preparationTime = preparationTime;

    await product.save();
    
    // Serialize ObjectIds to strings for frontend use
    const serializedProduct = {
      ...JSON.parse(JSON.stringify(product)),
      _id: product._id.toString(),
      categoryId: product.categoryId.toString(),
      restaurantId: product.restaurantId.toString()
    };
    
    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/products/[productId] - Delete product
export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    const { productId } = params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await MenuProduct.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: product.restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await MenuProduct.findByIdAndDelete(productId);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}