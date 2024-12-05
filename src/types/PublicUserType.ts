import { DatabaseEntity } from './database/DatabaseEntity'

export type PublicUserType = DatabaseEntity<{
    full_name?: string
    email?: string
    birthday?: Date
}>
