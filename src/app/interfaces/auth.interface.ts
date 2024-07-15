export interface AuthStrategy {
  validate(...args: any[]): any;
}
