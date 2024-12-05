import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserRecoveryChangePasswordRequest: RequestHandler<
    string,
    any,
    any,
    {
        email?: string
        code?: string
        password?: string
        confirmation?: string
    }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        Business.userRecovery.changePassword(req.query)
    })
}
