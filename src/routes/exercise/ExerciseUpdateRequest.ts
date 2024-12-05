import { RequestHandler } from 'express-serve-static-core'
import { DefaultRouterResolver } from '../DefaultRouterResolver'
import { TrainingBusiness } from '../../business/TrainingBusiness'
import { ExerciseType, TrainingType } from '../../types/TrainingType'
import { Business } from '../../business/Business'

export const ExerciseUpdateRequest: RequestHandler<
    string,
    any,
    ExerciseType,
    { id: string }
> = (req, res) => {
    DefaultRouterResolver(res, () => {
        if (req.currentUser) {
            return Business.exercise.update({
                currentUser: req.currentUser,
                id: req.query.id,
                entity: req.body,
            })
        }
    })
}
