import * as bcrypt from 'bcrypt'; // todo: migrate to bcryptjs


export class CryptoUtils {
  public static hash(value: string, saltOrRounds: number): string {
    return bcrypt.hashSync(value, saltOrRounds || 10);
  }


  public static compareHashes(data: string | Buffer, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }
}