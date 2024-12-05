import { RequestHandler } from 'express-serve-static-core'
import { LoginType } from '../../types/LoginType'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserLoginRequest: RequestHandler<
    string,
    {
        token: string
    },
    LoginType
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        return {
            token: Business.user.login(req.body),
        }
    })
}
