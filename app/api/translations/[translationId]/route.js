import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Translation from "@/models/Translation";
import Restaurant from "@/models/Restaurant";

// PUT /api/translations/[translationId] - Update translation
export async function PUT(req, { params }) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    const { translationId } = params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const translation = await Translation.findById(translationId);
    
    if (!translation) {
      return NextResponse.json({ error: "Translation not found" }, { status: 404 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: translation.restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { translatedText, isActive } = body;

    // Update fields
    if (translatedText !== undefined) translation.translatedText = translatedText;
    if (isActive !== undefined) translation.isActive = isActive;

    await translation.save();
    return NextResponse.json(translation);
  } catch (error) {
    console.error("Error updating translation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/translations/[translationId] - Delete translation
export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    const { translationId } = params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const translation = await Translation.findById(translationId);
    
    if (!translation) {
      return NextResponse.json({ error: "Translation not found" }, { status: 404 });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({ 
      _id: translation.restaurantId, 
      ownerId: session.user.id 
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Translation.findByIdAndDelete(translationId);
    return NextResponse.json({ message: "Translation deleted successfully" });
  } catch (error) {
    console.error("Error deleting translation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}