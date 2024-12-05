import { ErrorUtils } from '../utils/ErrorUtils'

export type ErrorType = {
    [key: string]: string | ErrorType
}

export class ErrorCollection {
    public errors: ErrorType = {}

    public add = (
        field?: string,
        code?: string,
        props?: [string, string][]
    ) => {
        let error = ErrorUtils.byCode(code)
        for (const prop of props || []) {
            error = error.replace(`$${prop[0]}`, prop[1])
        }
        const fields = field?.split('.') || []
        if (fields.length === 1) {
            this.errors[fields[0]] = error
        } else if (fields.length === 2) {
            if (!this.errors[fields[0]]) {
                this.errors[fields[0]] = {
                    [fields[1]]: error,
                }
            } else {
                ;(this.errors[fields[0]] as any)[fields[1]] = error
            }
        } else {
            if (!this.errors[fields[0]]) {
                this.errors[fields[0]] = {
                    [fields[1]]: {
                        [fields[2]]: error,
                    },
                }
            } else if (!(this.errors[fields[0]] as any)[fields[1]]) {
                ;(this.errors[fields[0]] as any)[fields[1]] = {
                    [fields[2]]: error,
                }
            } else {
                ;(this.errors[fields[0]] as any)[fields[1]][fields[2]] = error
            }
        }
    }

    public haveError = () => {
        return Object.keys(this.errors).length > 0
    }

    public throw = () => {
        if (this.haveError()) {
            throw this.errors
        }
    }

    public static simple = (field?: string, code?: string) => {
        throw {
            [field || 'error']: ErrorUtils.byCode(code),
        }
    }
}
