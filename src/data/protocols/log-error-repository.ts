export type LogErrorRepository = {
  log(stack: string): Promise<void>
}
