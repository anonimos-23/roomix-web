class RootError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'RootError'
  }
}

export { RootError }
