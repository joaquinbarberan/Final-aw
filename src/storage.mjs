import { put } from '@vercel/blob';

export async function subirImagen(buffer, nombreArchivo = 'sala.jpg') {
  const blob = await put(`diverty-park/${Date.now()}-${nombreArchivo}`, buffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}
