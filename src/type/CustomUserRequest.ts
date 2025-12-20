import { User } from '@/entity/User'

export interface CustomUserRequest extends Request {
    user: User
}
