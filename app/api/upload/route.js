import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { 
  validateImageFile, 
  uploadRestaurantImage, 
  uploadCategoryImage, 
  uploadProductImage,
  isS3Configured 
} from "@/libs/aws-s3";

// POST /api/upload - Upload image to S3
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if S3 is configured
    if (!isS3Configured()) {
      return NextResponse.json({ 
        error: "File upload not configured. Please set up AWS S3 credentials." 
      }, { status: 500 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'restaurant-logo', 'restaurant-cover', 'category', 'product'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: "Upload type not specified" }, { status: 400 });
    }

    // Validate file
    try {
      validateImageFile(file);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload based on type
    let imageUrl;
    try {
      switch (type) {
        case 'restaurant-logo':
          imageUrl = await uploadRestaurantImage(buffer, file.name, 'logo');
          break;
        case 'restaurant-cover':
          imageUrl = await uploadRestaurantImage(buffer, file.name, 'cover');
          break;
        case 'category':
          imageUrl = await uploadCategoryImage(buffer, file.name);
          break;
        case 'product':
          imageUrl = await uploadProductImage(buffer, file.name);
          break;
        default:
          return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
      }

      return NextResponse.json({ 
        imageUrl,
        message: "Image uploaded successfully" 
      });

    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ 
        error: "Failed to upload image" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// GET /api/upload - Check upload configuration status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      configured: isS3Configured(),
      maxFileSize: '10MB',
      allowedTypes: ['JPEG', 'PNG', 'WebP'],
      message: isS3Configured() 
        ? "File upload is configured and ready"
        : "File upload requires AWS S3 configuration"
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}