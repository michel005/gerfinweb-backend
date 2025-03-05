import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Token } from '../schema/token.schema'

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

    async create(userId: string): Promise<Token> {
        const inserted = new this.tokenModel({
            user: userId,
            token: uuidv4(),
        })
        return inserted.save()
    }

    async validate(tokenValue: string): Promise<Token> {
        const token = await this.tokenModel
            .findOne({ token: tokenValue })
            .populate('user', 'full_name email')
            .exec()

        if (!token) {
            throw new NotFoundException('Token inválido!')
        }

        return token
    }
}
