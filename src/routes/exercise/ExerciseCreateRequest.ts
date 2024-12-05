import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { ExerciseType } from '../../types/TrainingType'
import { Business } from '../../business/Business'

export const ExerciseCreateRequest: RequestHandler<
    string,
    any,
    ExerciseType
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.exercise.create({
                currentUser: req.currentUser,
                entity: req.body,
            })
        }
    })
}
