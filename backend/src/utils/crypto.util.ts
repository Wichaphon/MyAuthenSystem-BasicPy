import * as crypto from 'crypto';

const SECRET_KEY = 'vdfv9ui&&#fciko2#dvjskovvb_vlfl';

export function decryptPassword(encrypted: string): string {
  const [ivEncoded, ctEncoded] = encrypted.split(':');
  const iv = Buffer.from(ivEncoded, 'base64');
  const ct = Buffer.from(ctEncoded, 'base64');
  const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(ct);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
