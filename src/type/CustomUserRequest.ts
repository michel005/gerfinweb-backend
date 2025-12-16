import { User } from 'src/entity/User'

export interface CustomUserRequest extends Request {
    user: User
}
