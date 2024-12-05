import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { UserRecoveryBusiness } from '../../business/UserRecoveryBusiness'
import { Business } from '../../business/Business'

export const UserRecoveryCodeRequest: RequestHandler<
    string,
    any,
    any,
    {
        email?: string
        code?: string
    }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        Business.userRecovery.code({
            email: req.query.email,
            code: req.query.code,
        })
    })
}
