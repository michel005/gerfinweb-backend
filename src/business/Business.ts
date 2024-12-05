import { UserBusiness } from './UserBusiness'
import { UserTokenBusiness } from './UserTokenBusiness'
import { UserRecoveryBusiness } from './UserRecoveryBusiness'
import { TrainingBusiness } from './TrainingBusiness'
import { ExerciseBusiness } from './ExerciseBusiness'

export const Business = {
    training: new TrainingBusiness(),
    exercise: new ExerciseBusiness(),
    user: new UserBusiness(),
    userToken: new UserTokenBusiness(),
    userRecovery: new UserRecoveryBusiness(),
}
