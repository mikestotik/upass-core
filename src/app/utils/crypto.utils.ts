import * as bcrypt from 'bcryptjs';


export class CryptoUtils {

  public static hash(value: string, saltOrRounds: number | string = 10): string {
    return bcrypt.hashSync(value, saltOrRounds);
  }


  public static compareHashes(data: string, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }
}