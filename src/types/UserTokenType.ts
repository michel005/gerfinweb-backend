import { UserEntityType } from './UserEntityType'

export type UserTokenType = {
    token?: string
    expiration_date?: Date
} & UserEntityType
