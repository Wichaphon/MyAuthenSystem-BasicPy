import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Express } from 'express';

const storage = new Storage({
  keyFilename: 'gcs-key.json',
});

const bucketName = 'my-app-bucket-2025';
const bucket = storage.bucket(bucketName);

/**
 * Uploads image file to Google Cloud Storage and returns the public URL.
 * @param file Multer file from frontend (Express.Multer.File)
 * @returns public image URL
 */
export async function uploadImageToGCS(file: Express.Multer.File): Promise<string> {
  const ext = extname(file.originalname);
  const filename = `user-images/${uuidv4()}${ext}`;
  const blob = bucket.file(filename);

  const stream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));

    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
}

/**
 * Deletes an image from Google Cloud Storage using its public URL.
 * @param imageUrl Public URL of the image to delete
 */

export async function deleteImageFromGCS(imageUrl: string): Promise<void> {
  try {
    const prefix = `https://storage.googleapis.com/${bucketName}/`;
    if (!imageUrl.startsWith(prefix)) return;

    const filePath = imageUrl.substring(prefix.length); 
    await bucket.file(filePath).delete();
  } catch (err) {
    console.error('Failed to delete image from GCS:', err.message);
  }
}
