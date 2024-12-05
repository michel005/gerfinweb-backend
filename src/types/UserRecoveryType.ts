import { DatabaseEntity } from './database/DatabaseEntity'
import { UserEntityType } from './UserEntityType'

export type UserRecoveryType = DatabaseEntity<
    UserEntityType & {
        recovery_code?: string
        status?: 'CREATED' | 'EMAIL_SENT' | 'VALIDATED' | 'DONE'
    }
>
