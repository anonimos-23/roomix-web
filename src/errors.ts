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

class RootError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'RootError'
    }
}

export { ConfirmPasswordDismatchError, EmailAlreadyTakenError, RootError }