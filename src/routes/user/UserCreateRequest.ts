import { RequestHandler } from 'express-serve-static-core'
import { UserType } from '../../types/UserType'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserCreateRequest: RequestHandler<string, UserType> = (
    req,
    res
) => {
    DefaultRouterResolver(res, () => {
        Business.user.create({ user: req.body })
    })
}
