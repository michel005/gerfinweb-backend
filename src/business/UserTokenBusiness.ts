import { Database } from '../database/Database'
import { randomUUID } from 'node:crypto'

export class UserTokenBusiness {
    private client = Database.prismaClient

    public createToken = async ({ userId }: { userId: string }) => {
        const newToken = randomUUID()
        await this.client.user_token.create({
            data: {
                id: randomUUID(),
                token: newToken,
                user_id: userId,
                expiration_date: new Date(),
            },
        })

        return newToken
    }

    public removeByUserId = async ({ userId }: { userId: string }) => {
        await this.client.user_token.deleteMany({
            where: {
                user_id: userId,
            },
        })
    }
}
