export default interface TokenPayload {
  userId: string;
  grant: string;
  iat?: number;
  exp?: number;
}
