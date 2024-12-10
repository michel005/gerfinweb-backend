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
> = async (req, res) => {
    await DefaultRouterResolver(res, async () => {
        return {
            token: await Business.user.login(req.body),
        }
    })
}
