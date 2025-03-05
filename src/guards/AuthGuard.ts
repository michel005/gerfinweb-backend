import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { User } from '../schema/user.schema'
import { TokenService } from '../service/token.service'
import { UserService } from '../service/user.service'

export interface CustomRequest extends Request {
    user: User
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private tokenService: TokenService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: CustomRequest = context
            .switchToHttp()
            .getRequest<Request>() as any
        const authHeader = request.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token não fornecido ou inválido')
        }

        const token = authHeader.split(' ')[1]

        try {
            const tokenResponse = await this.tokenService.validate(token)
            request.user = await this.userService.findById(tokenResponse.user)
            return true
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
            throw new UnauthorizedException('Token inválido')
        }
    }
}
