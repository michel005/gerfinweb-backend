import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BankAccountTypeValues } from '@/constant/BankAccountType'
import { CustomUserRequest } from '@/type/CustomUserRequest'
import { CreateBankAccountDTO, GetAllBankAccountDTO, ResponseBankAccountDTO, ResponseBankAccountListDTO } from './dto'
import { UpdateBankAccountDTO } from './dto/UpdateBankAccountDTO'
import { AbstractPrivateController } from '@/feature/AbstractPrivateController'

@ApiTags('Bank Account')
@Controller('/bankAccount')
export class BankAccountController extends AbstractPrivateController {
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

    @Patch('/:id/adjustCurrentAmount')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da conta bancária',
    })
    @ApiParam({
        name: 'amount',
        required: true,
        type: Number,
        description: 'Valor para ajuste do saldo atual da conta bancária',
    })
    @ApiResponse({
        status: 200,
        description: 'Atualiza o saldo atual da conta bancária com sucesso',
        type: ResponseBankAccountDTO,
    })
    async adjustCurrentAmount(
        @Request() req: CustomUserRequest,
        @Param('id') id: string,
        @Param('id') amount: number
    ): Promise<void> {
        await this.bankAccountService.adjustCurrentAmount(req.user.id, id, amount)
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
    async getAll(
        @Request() req: CustomUserRequest,
        @Query('name')
        name?: GetAllBankAccountDTO['name'],
        @Query('type')
        type?: GetAllBankAccountDTO['type']
    ): Promise<ResponseBankAccountListDTO> {
        return await this.bankAccountService.getAll(req.user.id, {
            name,
            type,
        })
    }

    @Get('/getAllWithAmount')
    @ApiResponse({
        status: 200,
        description:
            'Retorna uma lista de contas bancárias de acordo com o filtro informado incluindo saldo atual e previsto',
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
        name: 'date',
        required: true,
        type: String,
        format: 'date',
        description: 'Data de referência para saldo atual e futuro',
        default: new Date().toISOString(),
    })
    async getAllWithAmount(
        @Request() req: CustomUserRequest,
        @Query('date')
        date: Date,
        @Query('name')
        name?: GetAllBankAccountDTO['name'],
        @Query('type')
        type?: GetAllBankAccountDTO['type']
    ): Promise<ResponseBankAccountListDTO> {
        return await this.bankAccountService.getAllWithAmount(
            req.user.id,
            {
                name,
                type,
            },
            date
        )
    }
}
