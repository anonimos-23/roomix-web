class ConfirmPasswordDismatchError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ConfirmPasswordDismatchError'
    }
}

class EmailAlreadyTakenError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'EmailAlreadyTakenError'
    }
}

export { ConfirmPasswordDismatchError, EmailAlreadyTakenError }