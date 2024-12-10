import { RequestHandler } from 'express-serve-static-core'
import { PublicUserType } from '../../types/PublicUserType'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserMeRequest: RequestHandler<
    string,
    {
        user: PublicUserType
    },
    {
        token?: string
    }
> = async (req: any, res) => {
    await DefaultRouterResolver(res, async () => {
        return Business.user.parseUser({
            user: req.currentUser,
        })
    })
}
