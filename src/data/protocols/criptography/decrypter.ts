export type Decrypter = {
  decrypt(value: string): Promise<string | null>
}
