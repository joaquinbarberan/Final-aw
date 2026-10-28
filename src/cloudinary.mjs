import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sube un buffer de imagen a Cloudinary y devuelve la URL segura
export async function subirImagen(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'diverty-park' },
      (error, resultado) => {
        if (error) reject(error);
        else resolve(resultado.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export default cloudinary;
