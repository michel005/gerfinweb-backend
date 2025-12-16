import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CustomBadRequestExceptionDTO } from 'src/dto'
import { CustomUserRequest } from 'src/type/CustomUserRequest'
import { BankAccountService } from './BankAccountService'
import { CreateBankAccountDTO, GetAllBankAccountDTO, ResponseBankAccountDTO, ResponseBankAccountListDTO } from './dto'
import { BankAccountTypeValues } from 'src/constant/BankAccountType'

@ApiTags('BankAccount')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
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
@Controller('/bankAccount')
export class BankAccountController {
    constructor(private bankAccountService: BankAccountService) {}

    @Post('/create')
    @ApiResponse({
        status: 200,
        description: 'Cadastra um usuário com sucesso',
        type: ResponseBankAccountDTO,
    })
    async create(
        @Request() req: CustomUserRequest,
        @Body() bankAccount: CreateBankAccountDTO
    ): Promise<ResponseBankAccountDTO> {
        return await this.bankAccountService.create(req.user.id, bankAccount)
    }

    @Get('/getAll')
    @ApiResponse({
        status: 200,
        description: 'Retorna uma lista de contas bancárias de acordo com o filtro informado',
        type: ResponseBankAccountListDTO,
    })
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        description: 'Nome da conta bancária',
    })
    @ApiQuery({
        name: 'type',
        required: false,
        type: String,
        enum: BankAccountTypeValues,
        description: 'Tipo da conta bancária',
    })
    @ApiQuery({
        name: 'page',
        required: true,
        type: Number,
        description: 'Número da página',
        default: 0,
    })
    @ApiQuery({
        name: 'size',
        required: true,
        type: Number,
        description: 'Quantidade de itens por página',
        default: 10,
    })
    async getAll(
        @Request() req: CustomUserRequest,
        @Query('page')
        page: GetAllBankAccountDTO['page'],
        @Query('size')
        size: GetAllBankAccountDTO['size'],
        @Query('name')
        name?: GetAllBankAccountDTO['name'],
        @Query('type')
        type?: GetAllBankAccountDTO['type']
    ): Promise<ResponseBankAccountListDTO> {
        return await this.bankAccountService.getAll(req.user.id, {
            name,
            type,
            page,
            size,
        })
    }
}
