import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { UserRecoveryBusiness } from '../../business/UserRecoveryBusiness'
import { Business } from '../../business/Business'

export const UserRecoverySendRequest: RequestHandler<
    string,
    any,
    any,
    {
        email?: string
    }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        Business.userRecovery.send({ email: req.query.email })
    })
}
