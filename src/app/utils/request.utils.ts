export namespace RequestUtils {
  export function getAuthorizationBearerToken(authorization?: string): string | null {
    if (authorization?.includes('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
    return null;
  }
}
