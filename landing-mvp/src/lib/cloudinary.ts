import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Загружает base64/URL изображение в Cloudinary и возвращает secure_url */
export async function uploadImage(fileBase64: string, folder = "landing-mvp"): Promise<string> {
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder,
    resource_type: "image",
    transformation: [{ width: 1600, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
  });
  return result.secure_url;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const publicId = `landing-mvp/${fileWithExt.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // не блокируем основной флоу, если удаление не удалось
  }
}

export default cloudinary;
