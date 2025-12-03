import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Crypto {
  
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = process.env.CRYPTO_SECRET_KEY;
  private readonly iv = process.env.CRYPTO_SECRET_IV; 

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
  }

  decrypt(data: string): string {
    const [encryptedHex] = data.split(':');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  encryptObject(object: Record<string, any>): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const json = JSON.stringify(object);
    let encrypted = cipher.update(json, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  hashEncrypt(data: string): string {
    const hash = crypto.createHash('sha512');
    hash.update(data);
    return hash.digest('hex');
  }

  async bcript(text: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(text, saltOrRounds);
    return hashedPassword;
  }
}