export type Encrypter = {
  encrypt: (value: string) => Promise<string>
}
