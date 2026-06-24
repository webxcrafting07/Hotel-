import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadImage(
  file: string,
  folder: string,
  options?: Record<string, unknown>
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `hotel-anand/${folder}`,
    resource_type: 'auto',
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
