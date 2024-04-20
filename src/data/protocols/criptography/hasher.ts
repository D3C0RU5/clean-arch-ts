export type Hasher = {
  hash: (value: string) => Promise<string>
}
