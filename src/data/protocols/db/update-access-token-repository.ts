export type UpdateAccessTokenRepository = {
  updateAccessToken(id: string, token: string): Promise<void>
}
