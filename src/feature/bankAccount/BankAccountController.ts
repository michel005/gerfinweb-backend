import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BankAccountTypeValues } from '@/constant/BankAccountType'
import { CustomBadRequestExceptionDTO } from '@/dto'
import { CustomUserRequest } from '@/type/CustomUserRequest'
import { BankAccountService } from './BankAccountService'
import { CreateBankAccountDTO, GetAllBankAccountDTO, ResponseBankAccountDTO, ResponseBankAccountListDTO } from './dto'
import { UpdateBankAccountDTO } from './dto/UpdateBankAccountDTO'

@ApiTags('Bank Account')
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

    @Put('/:id/update')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da conta bancária',
    })
    @ApiResponse({
        status: 200,
        description: 'Atualiza um usuário com sucesso',
        type: ResponseBankAccountDTO,
    })
    async update(
        @Request() req: CustomUserRequest,
        @Param('id') id: string,
        @Body() bankAccount: UpdateBankAccountDTO
    ): Promise<ResponseBankAccountDTO> {
        return await this.bankAccountService.update(req.user.id, id, bankAccount)
    }

    @Delete('/:id/delete')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da conta bancária',
    })
    @ApiResponse({
        status: 200,
        description: 'Deleta uma conta bancária com sucesso',
        type: ResponseBankAccountDTO,
    })
    async delete(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<void> {
        await this.bankAccountService.delete(req.user.id, id)
    }

    @Get('/:id/detail')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da recorrência',
    })
    @ApiResponse({
        status: 200,
        description: 'Retorna uma conta bancária com sucesso',
        type: ResponseBankAccountDTO,
    })
    async detail(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<ResponseBankAccountDTO> {
        return await this.bankAccountService.detail(req.user.id, id)
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
