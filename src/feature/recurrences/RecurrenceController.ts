import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CustomBadRequestExceptionDTO } from '@/dto'
import { PaginationDTO } from '@/dto/PaginationDTO'
import { CustomUserRequest } from '@/type/CustomUserRequest'
import { RecurrenceService } from './RecurrenceService'
import { CreateRecurrenceDTO, ResponseRecurrenceDTO, ResponseRecurrenceListDTO, UpdateRecurrenceDTO } from './dto'

@ApiTags('Recurrence')
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
@Controller('/recurrence')
export class RecurrenceController {
    constructor(private recurrenceService: RecurrenceService) {}

    @Post('/create')
    @ApiResponse({
        status: 200,
        description: 'Cadastra uma recorrência com sucesso',
        type: ResponseRecurrenceDTO,
    })
    async create(
        @Request() req: CustomUserRequest,
        @Body() recurrence: CreateRecurrenceDTO
    ): Promise<ResponseRecurrenceDTO> {
        return await this.recurrenceService.create(req.user.id, recurrence)
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
        description: 'Atualiza uma recorrência com sucesso',
        type: ResponseRecurrenceDTO,
    })
    async update(
        @Request() req: CustomUserRequest,
        @Param('id') id: string,
        @Body() recurrence: UpdateRecurrenceDTO
    ): Promise<ResponseRecurrenceDTO> {
        return await this.recurrenceService.update(req.user.id, id, recurrence)
    }

    @Delete('/:id/delete')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da recorrência',
    })
    @ApiResponse({
        status: 200,
        description: 'Deleta uma recorrência com sucesso',
        type: ResponseRecurrenceDTO,
    })
    async delete(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<void> {
        await this.recurrenceService.delete(req.user.id, id)
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
        description: 'Retorna uma recorrência com sucesso',
        type: ResponseRecurrenceDTO,
    })
    async detail(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<ResponseRecurrenceDTO> {
        return await this.recurrenceService.detail(req.user.id, id)
    }

    @Get('/getAll')
    @ApiResponse({
        status: 200,
        description: 'Retorna uma lista de recorrências de acordo com o filtro informado',
        type: ResponseRecurrenceListDTO,
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
        page: PaginationDTO['page'],
        @Query('size')
        size: PaginationDTO['size']
    ): Promise<ResponseRecurrenceListDTO> {
        return await this.recurrenceService.getAll(req.user.id, {
            page,
            size,
        })
    }
}
