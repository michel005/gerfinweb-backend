import { UserType } from '../types/UserType'
import { Database } from '../database/Database'
import { UserTokenType } from '../types/UserTokenType'
import { randomUUID } from 'node:crypto'
import { ErrorCollection } from '../types/ErrorCollection'
import { UserBusiness } from './UserBusiness'

export class UserTokenBusiness {
    public database: Database<UserTokenType> = new Database<UserTokenType>(
        'user_token'
    )

    public removeByUserId = ({ userId }: { userId?: string }) => {
        this.database
            .find((x) => x.user_id === userId)
            .forEach((x) => {
                this.database.remove(x.id)
            })
    }

    public createToken = ({ user_id }: { user_id?: string }) => {
        const newToken = randomUUID()

        this.database.save({
            user_id,
            expiration_date: new Date(),
            token: newToken,
        })

        return newToken
    }

    public validateToken = ({ token }: { token?: string }) => {
        const funded = this.database.find((x) => x.token === token)
        if (funded.length > 0) {
            return funded[0].user_id
        } else {
            throw ErrorCollection.simple('error', 'TOKEN-001')
        }
    }
}
