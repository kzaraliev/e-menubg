# Image Upload Setup Guide

## Overview

The E-Menu platform now supports direct image uploads using AWS S3 storage. Users can upload images for restaurants (logo & cover), categories, and products directly through the dashboard interface.

## Features

✅ **Direct Upload Interface**: Drag & drop or click to upload  
✅ **Automatic Optimization**: Images are resized and compressed automatically  
✅ **Multiple Upload Types**: Restaurant logos, covers, categories, and products  
✅ **File Validation**: Size and format checking  
✅ **Real-time Preview**: Immediate visual feedback  
✅ **Error Handling**: User-friendly error messages  
✅ **Bulgarian Localization**: All text in Bulgarian

## AWS S3 Setup

### 1. Create S3 Bucket

1. Log into AWS Console → S3
2. Create a new bucket (e.g., `e-menu-images-production`)
3. **Region**: Choose `eu-central-1` (Frankfurt) for European users
4. **Public Access**: Allow public read access for images
5. **Versioning**: Optional but recommended

### 2. Bucket Policy

Add this bucket policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### 3. CORS Configuration

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
        "ExposeHeaders": []
    }
]
```

### 4. IAM User Setup

Create an IAM user with these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Environment Variables

Add these to your `.env.local` file:

```env
# AWS S3 Configuration (Required for image uploads)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_REGION=eu-central-1
```

## Image Specifications

### Restaurant Logo
- **Recommended Size**: 400x400px
- **Format**: JPEG, PNG, WebP
- **Usage**: Menu header, restaurant profile
- **Optimization**: Resized to 400x400, 90% quality

### Restaurant Cover
- **Recommended Size**: 1200x600px  
- **Format**: JPEG, PNG, WebP
- **Usage**: Menu header background
- **Optimization**: Resized to 1200x600, 90% quality

### Category Images
- **Recommended Size**: 800x600px
- **Format**: JPEG, PNG, WebP
- **Usage**: Category headers
- **Optimization**: Resized to 800x600, 85% quality

### Product Images
- **Recommended Size**: 800x600px
- **Format**: JPEG, PNG, WebP
- **Usage**: Product cards, detailed view
- **Optimization**: Resized to 800x600, 85% quality

## File Limitations

- **Maximum Size**: 10MB per file
- **Allowed Formats**: JPEG, JPG, PNG, WebP
- **Automatic Processing**: All images are optimized automatically

## API Endpoints

### Upload Image
```
POST /api/upload
Content-Type: multipart/form-data

Form Data:
- file: Image file
- type: 'restaurant-logo' | 'restaurant-cover' | 'category' | 'product'

Response:
{
  "imageUrl": "https://bucket.s3.region.amazonaws.com/path/to/image.jpg",
  "message": "Image uploaded successfully"
}
```

### Check Upload Status
```
GET /api/upload

Response:
{
  "configured": true,
  "maxFileSize": "10MB",
  "allowedTypes": ["JPEG", "PNG", "WebP"],
  "message": "File upload is configured and ready"
}
```

## Storage Structure

Images are organized in S3 with this structure:

```
bucket-name/
├── restaurants/
│   ├── logo/
│   │   └── timestamp-random.jpg
│   └── cover/
│       └── timestamp-random.jpg
├── categories/
│   └── timestamp-random.jpg
└── products/
    └── timestamp-random.jpg
```

## Cost Estimation

### AWS S3 Costs (eu-central-1)
- **Storage**: ~$0.023/GB per month
- **Requests**: ~$0.0004 per 1,000 PUT requests
- **Data Transfer**: Free for first 1GB/month

### Example Monthly Costs
- **Small Restaurant** (50 images, 500MB): ~$0.01/month
- **Medium Restaurant** (200 images, 2GB): ~$0.05/month  
- **Large Restaurant** (500 images, 5GB): ~$0.12/month

## Troubleshooting

### Upload Failing
1. Check AWS credentials in environment variables
2. Verify bucket permissions and CORS settings
3. Ensure bucket exists and is in correct region
4. Check file size (must be under 10MB)
5. Verify file format (JPEG, PNG, WebP only)

### Images Not Displaying
1. Check bucket public read permissions
2. Verify CORS configuration
3. Check browser network tab for 403/404 errors
4. Ensure image URLs are valid

### Performance Issues
1. Consider enabling CloudFront CDN
2. Use WebP format for better compression
3. Implement lazy loading on frontend

## Security Considerations

- Images are publicly accessible (required for menu display)
- No sensitive information should be in image filenames
- Consider implementing virus scanning for production
- Monitor S3 costs and usage regularly
- Implement rate limiting on upload endpoint

## Fallback for Development

If AWS S3 is not configured, the system falls back to URL input fields. Users can still enter image URLs manually, but won't have the upload functionality.