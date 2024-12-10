import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserRemoveRequest: RequestHandler<
    string,
    any,
    {
        password?: string
    }
> = async (req, res) => {
    await DefaultRouterResolver(res, async () => {
        await Business.user.remove({
            currentUser: req.currentUser,
            password: req.body?.password,
        })
    })
}
