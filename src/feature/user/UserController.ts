import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CustomBadRequestExceptionDTO } from 'src/dto'
import { AuthService } from '../../authentication/AuthService'
import {
    CreateUserDTO,
    LoginResponseUserDTO,
    LoginUserDTO,
    RemoveUserDTO,
    ResponseUserDTO,
    UpdatePasswordUserDTO,
    UpdateUserDTO,
} from './dto'
import { UserService } from './UserService'

@ApiTags('User')
@Controller('/user')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    @Post('/create')
    @ApiResponse({
        status: 200,
        description: 'Cadastra um usuário com sucesso',
        type: ResponseUserDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Erros diversos de validação',
        type: CustomBadRequestExceptionDTO,
    })
    async create(@Body() createUserDto: CreateUserDTO): Promise<ResponseUserDTO> {
        return this.userService.create({ user: createUserDto })
    }

    @Post('/login')
    @ApiResponse({
        status: 200,
        description: 'Realiza o login do usuário com sucesso, retornando um token JWT',
        type: LoginResponseUserDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Erros diversos de validação',
        type: CustomBadRequestExceptionDTO,
    })
    async login(@Body() login: LoginUserDTO) {
        const response = await this.authService.validateUser(login.email, login.password)
        if (!response) {
            throw new BadRequestException('Usuário / Senha inválido!')
        }
        return this.authService.login({
            username: response.email,
            userId: response.id,
        })
    }

    @Get('/me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @ApiResponse({
        status: 200,
        description: 'Retorna as informações do usuário logado',
        type: ResponseUserDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Usuário não autorizado',
        type: CustomBadRequestExceptionDTO,
    })
    async me(@Request() req) {
        return req.user.toDTO()
    }

    @Patch('/updateInfo')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({
        status: 200,
        description: 'Atualiza as informações do usuário',
        type: ResponseUserDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Erros diversos de validação',
        type: CustomBadRequestExceptionDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Usuário não autorizado',
        type: CustomBadRequestExceptionDTO,
    })
    async updateInfo(@Request() req, @Body() dto: UpdateUserDTO) {
        return this.userService.update({
            id: req.user.id,
            user: dto,
        })
    }

    @Patch('/updatePassword')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({
        status: 200,
        description: 'Atualiza as senha do usuário',
        type: ResponseUserDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Erros diversos de validação',
        type: CustomBadRequestExceptionDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Usuário não autorizado',
        type: CustomBadRequestExceptionDTO,
    })
    async updatePassword(@Request() req, @Body() dto: UpdatePasswordUserDTO) {
        return this.userService.updatePassword({
            id: req.user.id,
            oldPassword: dto.oldPassword,
            newPassword: dto.newPassword,
            passwordConfirmation: dto.passwordConfirmation,
        })
    }

    @Delete('/delete')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({
        status: 200,
        description: 'Remove todos os dados do usuário',
    })
    @ApiResponse({
        status: 400,
        description: 'Erros diversos de validação',
        type: CustomBadRequestExceptionDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Usuário não autorizado',
        type: CustomBadRequestExceptionDTO,
    })
    async delete(@Request() req, @Body() dto: RemoveUserDTO) {
        return this.userService.remove({
            id: req.user.id,
            password: dto.password,
        })
    }
}
