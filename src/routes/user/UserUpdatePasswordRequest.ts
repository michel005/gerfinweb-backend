import { RequestHandler } from 'express-serve-static-core'
import { UserBusiness } from '../../business/UserBusiness'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { UserTokenBusiness } from '../../business/UserTokenBusiness'
import { Business } from '../../business/Business'

export const UserUpdatePasswordRequest: RequestHandler<
    string,
    any,
    {
        current?: string
        new_password?: string
        confirmation?: string
    }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        Business.user.updatePassword({
            currentUser: req.currentUser,
            current: req.body.current,
            new_password: req.body.new_password,
            confirmation: req.body.confirmation,
        })

        Business.userToken.removeByUserId({ userId: req.currentUser?.id })
    })
}
