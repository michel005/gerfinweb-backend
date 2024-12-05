import Errors from '../../errors.json'

export class ErrorUtils {
    static byCode = (code?: string) => {
        return (Errors as any)?.[code || ''] || code
    }
}
