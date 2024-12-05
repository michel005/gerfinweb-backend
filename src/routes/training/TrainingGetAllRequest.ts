import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const TrainingGetAllRequest: RequestHandler<string, any, any, any> = (
    req,
    res
) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.training.getAll({
                currentUser: req.currentUser,
            })
        }
    })
}
