export type UpdateAccessTokenRepository = {
  update(id: string, token: string): Promise<void>
}
