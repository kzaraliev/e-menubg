import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// Configure AWS S3 Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Generate unique filename
const generateFileName = (originalName, prefix = 'image') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop().toLowerCase();
  return `${prefix}/${timestamp}-${random}.${extension}`;
};

// Optimize image using Sharp
const optimizeImage = async (buffer, options = {}) => {
  const {
    width = 1200,
    height = 800,
    quality = 85,
    format = 'jpeg'
  } = options;

  try {
    const optimized = await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer();

    return optimized;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw new Error('Failed to optimize image');
  }
};

// Upload image to S3
export const uploadImageToS3 = async (fileBuffer, fileName, options = {}) => {
  try {
    // Optimize the image first
    const optimizedBuffer = await optimizeImage(fileBuffer, options);
    
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: optimizedBuffer,
      ContentType: `image/${options.format || 'jpeg'}`,
      CacheControl: 'max-age=31536000', // 1 year cache
    });

    await s3Client.send(uploadCommand);
    
    // Construct the URL manually since v3 doesn't return Location
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_S3_REGION || 'eu-central-1'}.amazonaws.com/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image to S3');
  }
};

// Delete image from S3
export const deleteImageFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes(bucketName)) {
      return; // Not an S3 image or invalid URL
    }

    // Extract key from URL
    const urlParts = imageUrl.split('/');
    const key = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    console.log(`Deleted image: ${key}`);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    // Don't throw error - deletion failure shouldn't break the main operation
  }
};

// Upload restaurant image
export const uploadRestaurantImage = async (fileBuffer, fileName, type = 'logo') => {
  const options = {
    width: type === 'logo' ? 400 : 1200,
    height: type === 'logo' ? 400 : 600,
    quality: 90,
    format: 'jpeg'
  };
  
  const s3FileName = generateFileName(fileName, `restaurants/${type}`);
  return await uploadImageToS3(fileBuffer, s3FileName, options);
};

// Upload category image
export const uploadCategoryImage = async (fileBuffer, fileName) => {
  const options = {
    width: 800,
    height: 600,
    quality: 85,
    format: 'jpeg'
  };
  
  const s3FileName = generateFileName(fileName, 'categories');
  return await uploadImageToS3(fileBuffer, s3FileName, options);
};

// Upload product image
export const uploadProductImage = async (fileBuffer, fileName) => {
  const options = {
    width: 800,
    height: 600,
    quality: 85,
    format: 'jpeg'
  };
  
  const s3FileName = generateFileName(fileName, 'products');
  return await uploadImageToS3(fileBuffer, s3FileName, options);
};

// Validate image file
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  return true;
};

// Check if S3 is configured
export const isS3Configured = () => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  );
};

export default {
  uploadRestaurantImage,
  uploadCategoryImage,
  uploadProductImage,
  deleteImageFromS3,
  validateImageFile,
  isS3Configured
};