import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from '../dto/create-user.dto'
import { Account } from '../schema/account.schema'
import { Movement } from '../schema/movement.schema'
import { User } from '../schema/user.schema'
import { ErrorCollection } from '../utils/ErrorUtils'
import { AbstractService } from './abstract.service'
import { TokenService } from './token.service'

@Injectable()
export class UserService extends AbstractService<User> {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Account.name) private accountModel: Model<Account>,
        @InjectModel(Movement.name) private movementModel: Model<Movement>,
        private tokenService: TokenService
    ) {
        super(userModel)
    }

    validateCreate(user: any) {
        const errors = new ErrorCollection()
        errors.add(
            'fullName',
            'VALIDATE-001',
            !user.fullName || user.fullName === ''
        )
        errors.add('email', 'VALIDATE-001', !user.email || user.email === '')
        errors.add(
            'password',
            'VALIDATE-001',
            !user.password || user.password === ''
        )
        errors.add(
            'passwordConfirmation',
            'VALIDATE-001',
            !user.passwordConfirmation || user.passwordConfirmation === ''
        )
        errors.add(
            'passwordConfirmation',
            'USER-002',
            user.password !== user.passwordConfirmation
        )
        errors.add('error', 'USER-001', !user.acceptTerms)
        errors.throw()
    }

    validateUpdate(user: any) {
        const errors = new ErrorCollection()
        errors.add(
            'fullName',
            'VALIDATE-001',
            !user.fullName || user.fullName === ''
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

    async clear(userId: string, password: string): Promise<void> {
        const errors = new ErrorCollection()
        errors.add('password', 'USER-003', !password || password === '')
        errors.throw()

        const response = await this.userModel.find({
            _id: userId,
            password,
        })

        errors.add('password', 'USER-004', !response?.[0])
        errors.throw()

        await this.movementModel
            .deleteMany({
                user: userId,
            })
            .exec()

        await this.accountModel
            .deleteMany({
                user: userId,
            })
            .exec()
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
