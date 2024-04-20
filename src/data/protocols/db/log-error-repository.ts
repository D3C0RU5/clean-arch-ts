export type LogErrorRepository = {
  logError(stack: string): Promise<void>
}
