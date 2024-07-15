import * as passGenerator from 'generate-password';


export namespace RandomUtils {
  export function generatePassword() {
    return passGenerator.generate({
      length: 16,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true
    });
  }


  export function generateCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}