import { RequestHandler } from 'express-serve-static-core'
import { UserType } from '../../types/UserType'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserCreateRequest: RequestHandler<string, UserType> = async (
    req,
    res
) => {
    await DefaultRouterResolver(res, async () => {
        await Business.user.create({ user: req.body })
    })
}
