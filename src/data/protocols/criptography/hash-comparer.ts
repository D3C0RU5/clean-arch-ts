export type HashComparer = {
  compare(value: string, hash: string): Promise<boolean>
}
