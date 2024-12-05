import { Request } from 'express'

export class SessionUtils {
    static tokenByRequest = (req: Request<any, any, any, any>) => {
        return req.header('Authorization')?.split(' ')?.[1]
    }
}
