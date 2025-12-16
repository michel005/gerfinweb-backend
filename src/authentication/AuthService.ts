import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UserService } from '../feature/user/UserService'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async validateUser(email: string, password: string) {
        const response = await this.userService.findByEmail({
            email,
        })
        return (await bcrypt.compare(password, response?.password || ''))
            ? response
            : null
    }

    async login(user: { username: string; userId: string }) {
        return {
            access_token: this.jwtService.sign({
                username: user.username,
                sub: user.userId,
            }),
        }
    }
}
