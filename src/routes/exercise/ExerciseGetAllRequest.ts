import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { Business } from '../../business/Business'

export const ExerciseGetAllRequest: RequestHandler<
    string,
    any,
    any,
    { training_id: string }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.exercise.getByTrainingId({
                trainingId: req.query.training_id,
                currentUser: req.currentUser,
            })
        }
    })
}
