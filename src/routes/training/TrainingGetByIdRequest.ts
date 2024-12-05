import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const TrainingGetByIdRequest: RequestHandler<
    string,
    any,
    any,
    { id: string }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.training.getById({
                id: req.query.id,
                currentUser: req.currentUser,
            })
        }
    })
}
