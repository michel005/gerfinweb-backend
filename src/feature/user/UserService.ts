import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from '@/entity/User'
import { CreateUserDTO, ResponseUserDTO, UpdateUserDTO } from './dto'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) readonly userRepository: Repository<User>) {}

    async findByEmail({ email }: { email: string }) {
        const response = await this.userRepository.findOne({
            where: {
                email,
            },
        })
        return response
    }

    async create({ user }: { user: CreateUserDTO }): Promise<ResponseUserDTO> {
        const existingUser = await this.findByEmail({
            email: user.email,
        })
        if (existingUser) {
            throw new BadRequestException('Email já cadastrado!')
        }

        const newUser = User.fromDTO(user)
        await newUser.beforeInsert()
        newUser.password = await bcrypt.hash(user.password, 10)

        const response: any = await this.userRepository.save(newUser)
        return response.toDTO()
    }

    async update({ id, user }: { id: string; user: UpdateUserDTO }): Promise<ResponseUserDTO> {
        const existingUser = await this.userRepository.findOne({
            where: {
                id,
            },
        })
        if (!existingUser) {
            throw new BadRequestException('Usuário inválido!')
        }
        existingUser.fullName = user.fullName
        existingUser.birthDate = user.birthDate
        existingUser.profilePicture = user.profilePicture

        const response: any = await this.userRepository.save(existingUser)
        return response.toDTO()
    }

    async updatePassword({
        id,
        oldPassword,
        newPassword,
        passwordConfirmation,
    }: {
        id: string
        oldPassword: string
        newPassword: string
        passwordConfirmation: string
    }): Promise<ResponseUserDTO> {
        const existingUser = await this.userRepository.findOne({
            where: {
                id,
            },
        })
        if (!existingUser) {
            throw new BadRequestException('Usuário inválido!')
        }
        if (!(await bcrypt.compare(oldPassword, existingUser.password))) {
            throw new BadRequestException('Senha antiga incorreta!')
        }
        if (newPassword !== passwordConfirmation) {
            throw new BadRequestException('Senhas não conferem!')
        }
        existingUser.password = await bcrypt.hash(newPassword, 10)

        const response: any = await this.userRepository.save(existingUser)
        return response.toDTO()
    }

    async remove({ id, password }: { id: string; password: string }): Promise<void> {
        const existingUser = await this.userRepository.findOne({
            where: {
                id,
            },
        })
        if (!existingUser) {
            throw new BadRequestException('Usuário inválido!')
        }
        if (!(await bcrypt.compare(password, existingUser.password))) {
            throw new BadRequestException('Senha incorreta!')
        }
        await this.userRepository.delete(id)
    }
}
