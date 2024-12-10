import { UserBusiness } from './UserBusiness'
import { UserTokenBusiness } from './UserTokenBusiness'
import { UserRecoveryBusiness } from './UserRecoveryBusiness'

export const Business = {
    user: new UserBusiness(),
    userToken: new UserTokenBusiness(),
    userRecovery: new UserRecoveryBusiness(),
}
