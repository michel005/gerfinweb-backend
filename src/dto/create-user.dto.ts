import { User } from '../schema/user.schema'

export class CreateUserDto extends User {
    passwordConfirmation: string
    acceptTerms: boolean
}
