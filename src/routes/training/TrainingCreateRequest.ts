import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { TrainingType } from '../../types/TrainingType'
import { Business } from '../../business/Business'

export const TrainingCreateRequest: RequestHandler<
    string,
    any,
    TrainingType
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.training.create({
                currentUser: req.currentUser,
                entity: {
                    ...req.body,
                    status: 'OPEN',
                },
            })
        }
    })
}
