import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { TrainingBusiness } from '../../business/TrainingBusiness'
import { TrainingType } from '../../types/TrainingType'
import { Business } from '../../business/Business'

export const TrainingUpdateRequest: RequestHandler<
    string,
    any,
    TrainingType,
    { id: string }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.training.update({
                currentUser: req.currentUser,
                id: req.query.id,
                entity: req.body,
            })
        }
    })
}
