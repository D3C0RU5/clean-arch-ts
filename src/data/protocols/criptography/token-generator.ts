export type TokenGenerator = {
  generate(id: string): Promise<string>
}
