import { RequestHandler } from 'express-serve-static-core'
import { PublicUserType } from '../../types/PublicUserType'
import { DefaultRouterResolver } from '../DefaultRouterResolver'

export const UserMeRequest: RequestHandler<
    string,
    {
        user: PublicUserType
    },
    {
        token?: string
    }
> = (req: any, res) => {
    DefaultRouterResolver(res, () => {
        return {
            ...req.currentUser,
            password: undefined,
            id: undefined,
        }
    })
}
