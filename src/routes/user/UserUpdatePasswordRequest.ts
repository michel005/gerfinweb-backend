import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const UserUpdatePasswordRequest: RequestHandler<
    string,
    any,
    {
        current?: string
        new_password?: string
        confirmation?: string
    }
> = async (req, res) => {
    await DefaultRouterResolver(res, async () => {
        await Business.user.updatePassword({
            currentUser: req.currentUser,
            current: req.body.current,
            new_password: req.body.new_password,
            confirmation: req.body.confirmation,
        })
    })
}
