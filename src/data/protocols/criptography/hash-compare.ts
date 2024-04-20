export type HashCompare = {
  compare(value: string, hash: string): Promise<boolean>
}
