//src/utils/image.util.ts
import axios from 'axios';

export async function convertImageUrlToBase64(url: string): Promise<string | null> {
  if (!url) return null;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    const mimeMatch = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
    const ext = mimeMatch?.[1] || 'jpeg';
    const mimeType = `image/${ext}`;

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to fetch image from ${url}`, error);
    return null;
  }
}
