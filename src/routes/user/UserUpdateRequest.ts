import { RequestHandler } from 'express-serve-static-core'
import { UserType } from '../../types/UserType'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserUpdateRequest: RequestHandler<string, UserType> = (
    req,
    res
) => {
    DefaultRouterResolver(res, () => {
        const user = Business.user.update({
            currentUser: req.currentUser,
            user: req.body,
        })

        return {
            ...user,
            password: undefined,
            id: undefined,
            save_date: undefined,
        }
    })
}
