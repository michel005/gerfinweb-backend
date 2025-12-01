import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { AuthGuard, CustomRequest } from '../guards/AuthGuard'
import { User } from '../schema/user.schema'
import { UserService } from '../service/user.service'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.userService.create(body)
    }

    @Put()
    @UseGuards(AuthGuard)
    update(@Request() req: CustomRequest, @Body() body: User) {
        return this.userService.update(req.user._id, {
            fullName: body.fullName,
            birthday: body.birthday,
            picture: body.picture,
            colorSchema: body.colorSchema,
        })
    }

    @Delete()
    @UseGuards(AuthGuard)
    delete(@Request() req: CustomRequest) {
        return this.userService.delete(req.user._id)
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    me(@Request() req: CustomRequest) {
        return req.user as User
    }

    @Post('/login')
    login(@Body() body: { email: string; password: string }) {
        return this.userService.login(body.email, body.password)
    }

    @Post('/clear')
    @UseGuards(AuthGuard)
    clear(@Request() req: CustomRequest, @Body() body: { password: string }) {
        return this.userService.clear(req.user._id, body.password)
    }

    @Post('/changePassword')
    @UseGuards(AuthGuard)
    changePassword(
        @Request() req: CustomRequest,
        @Body()
        body: { old: string; new_password: string; confirmation: string }
    ) {
        return this.userService.chanePassword(
            req.user._id,
            body.old,
            body.new_password,
            body.confirmation
        )
    }
}
