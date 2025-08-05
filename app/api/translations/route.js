import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Translation from "@/models/Translation";
import Restaurant from "@/models/Restaurant";

// GET /api/translations?restaurantId=xxx&language=xx - Get translations for a restaurant
export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    const language = searchParams.get('language');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    
    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
    }

    // Build query
    let query = { restaurantId, isActive: true };
    if (language) query.language = language;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;

    const translations = await Translation.find(query).sort({ entityType: 1, entityId: 1, field: 1 });
    return NextResponse.json(translations);
  } catch (error) {
    console.error("Error fetching translations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/translations - Create or update translation
export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { entityType, entityId, field, language, translatedText, restaurantId } = body;

    // Validate required fields
    if (!entityType || !entityId || !field || !language || !translatedText || !restaurantId) {
      return NextResponse.json({ 
        error: "All fields are required: entityType, entityId, field, language, translatedText, restaurantId" 
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

    // Validate entity type
    const validEntityTypes = ['restaurant', 'category', 'menuProduct'];
    if (!validEntityTypes.includes(entityType)) {
      return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
    }

    // Validate language code (2-character)
    if (!/^[a-z]{2}$/.test(language)) {
      return NextResponse.json({ error: "Language must be a 2-character code" }, { status: 400 });
    }

    // Check if translation already exists and update, or create new
    const existingTranslation = await Translation.findOne({
      entityType,
      entityId,
      field,
      language,
      restaurantId
    });

    let translation;
    if (existingTranslation) {
      // Update existing translation
      existingTranslation.translatedText = translatedText;
      existingTranslation.isActive = true;
      translation = await existingTranslation.save();
    } else {
      // Create new translation
      translation = new Translation({
        entityType,
        entityId,
        field,
        language,
        translatedText,
        restaurantId
      });
      await translation.save();
    }

    return NextResponse.json(translation, { status: existingTranslation ? 200 : 201 });
  } catch (error) {
    console.error("Error creating translation:", error);
    
    if (error.code === 11000) {
      return NextResponse.json({ error: "Translation already exists" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}