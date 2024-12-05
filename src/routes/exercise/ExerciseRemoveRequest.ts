import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { TrainingBusiness } from '../../business/TrainingBusiness'
import { Business } from '../../business/Business'

export const ExerciseRemoveRequest: RequestHandler<
    string,
    any,
    any,
    { id: string }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            Business.exercise.remove({
                currentUser: req.currentUser,
                id: req.query.id,
            })
        }
    })
}
