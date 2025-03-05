import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard, CustomRequest } from '../guards/AuthGuard'
import { Account } from '../schema/account.schema'
import { AccountService } from '../service/account.service'

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Request() req: CustomRequest, @Body() body: Account) {
        return this.accountService.create({
            ...body,
            user: req.user._id,
        })
    }

    @Put()
    @UseGuards(AuthGuard)
    update(
        @Request() req: CustomRequest,
        @Query('id') id: string,
        @Body() body: Account
    ) {
        return this.accountService.update(id, {
            user: req.user._id,
            name: body.name,
            type: body.type,
            agencyNumber: body.agencyNumber,
            accountNumber: body.accountNumber,
            pixCode: body.pixCode,
        })
    }

    @Delete()
    @UseGuards(AuthGuard)
    delete(@Request() req: CustomRequest, @Query('id') id: string) {
        return this.accountService.delete(id)
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(
        @Request() req: CustomRequest,
        @Query('search') search: string,
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        return await this.accountService.findAll(
            req.user._id,
            search || '',
            month || '',
            year || ''
        )
    }
}
