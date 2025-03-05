import { User } from '../schema/user.schema'

export class CreateUserDto extends User {
    password_confirm: string
    accept_terms: boolean
}
