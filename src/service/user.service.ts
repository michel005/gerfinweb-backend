import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from '../dto/create-user.dto'
import { User } from '../schema/user.schema'
import { ErrorCollection } from '../utils/ErrorUtils'
import { AbstractService } from './abstract.service'
import { TokenService } from './token.service'

@Injectable()
export class UserService extends AbstractService<User> {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private tokenService: TokenService
    ) {
        super(userModel)
    }

    validateCreate(user: any) {
        const errors = new ErrorCollection()
        errors.add(
            'full_name',
            'VALIDATE-001',
            !user.full_name || user.full_name === ''
        )
        errors.add('email', 'VALIDATE-001', !user.email || user.email === '')
        errors.add(
            'password',
            'VALIDATE-001',
            !user.password || user.password === ''
        )
        errors.add(
            'password_confirm',
            'VALIDATE-001',
            !user.password_confirm || user.password_confirm === ''
        )
        errors.add(
            'password_confirm',
            'USER-002',
            user.password !== user.password_confirm
        )
        errors.add('error', 'USER-001', !user.accept_terms)
        errors.throw()
    }

    validateUpdate(user: any) {
        const errors = new ErrorCollection()
        errors.add(
            'full_name',
            'VALIDATE-001',
            !user.full_name || user.full_name === ''
        )
        errors.throw()
    }

    async findById(id: string): Promise<User> {
        const response = await this.userModel.findById(id)

        if (!response) {
            throw new NotFoundException('E-mail e/ou senha inválidos!')
        }
        return response
    }

    async login(email: string, password: string): Promise<{ token: string }> {
        const response = await this.userModel.find({
            email,
            password,
        })

        const user = response?.[0]

        if (!user) {
            throw new NotFoundException('E-mail e/ou senha inválidos!')
        }

        const token = await this.tokenService.create(user._id)

        return {
            token: token.token,
        }
    }

    async chanePassword(
        id: string,
        old: string,
        new_password: string,
        confirmation: string
    ): Promise<void> {
        const error = new ErrorCollection()
        error.add('old', 'VALIDATE-001', !old || old === '')
        error.add(
            'new_password',
            'VALIDATE-001',
            !new_password || new_password === ''
        )
        error.add(
            'confirmation',
            'VALIDATE-001',
            !confirmation || confirmation === ''
        )
        error.add('confirmation', 'USER-002', new_password !== confirmation)
        error.throw()

        await this.userModel.findOneAndUpdate(
            { _id: id, password: old },
            {
                password: new_password,
            }
        )
    }
}
