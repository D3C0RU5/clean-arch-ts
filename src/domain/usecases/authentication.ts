export type Authentication = {
  auth(email: string, password: string): Promise<string | null>
}
