// backend/src/services/cloudinaryService.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file, folder = 'profile-images') => {
  try {
    const { createReadStream } = await file;
    const stream = createReadStream();
    
    const uploadOptions = {
      folder: `powerpulse/${folder}`,
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 500, height: 500, crop: 'fill' }]
    };

    // Create upload promise
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      
      stream.pipe(uploadStream);
    });

    const result = await uploadPromise;
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: 'IMAGE'
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};