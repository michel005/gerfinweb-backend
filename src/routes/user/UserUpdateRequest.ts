import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'
import { user } from '@prisma/client'

export const UserUpdateRequest: RequestHandler<string, user> = async (
    req,
    res
) => {
    await DefaultRouterResolver(res, async () => {
        return await Business.user.update({
            currentUser: req.currentUser,
            user: req.body,
        })
    })
}
