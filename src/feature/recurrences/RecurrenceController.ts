import { AbstractPrivateController } from '@/feature/AbstractPrivateController'
import { ResponseMovementDTO } from '@/feature/movement/dto'
import { CustomUserRequest } from '@/type/CustomUserRequest'
import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common'
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateRecurrenceDTO, ResponseRecurrenceDTO, UpdateRecurrenceDTO } from './dto'
import { CreateBatchRecurrenceDTO } from './dto/CreateBatchRecurrenceDTO'

@ApiTags('Recurrence')
@Controller('/recurrence')
export class RecurrenceController extends AbstractPrivateController {
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

    @Post('/createBatch')
    @ApiResponse({
        status: 200,
        description: 'Cadastra várias recorrências com sucesso',
    })
    async createBatch(@Request() req: CustomUserRequest, @Body() recurrence: CreateBatchRecurrenceDTO): Promise<void> {
        return await this.recurrenceService.createBatch(req.user.id, recurrence)
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

    @Get('/:id/toMovement/:year/:month')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da recorrência',
    })
    @ApiParam({
        name: 'year',
        required: true,
        type: Number,
        description: 'Ano da movimentação',
        example: new Date().getFullYear(),
    })
    @ApiParam({
        name: 'month',
        required: true,
        type: Number,
        description: 'Mês da movimentação',
        example: new Date().getMonth() + 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Retorna uma recorrência convertida para movimentação com sucesso',
        type: ResponseMovementDTO,
    })
    async toMovement(
        @Request() req: CustomUserRequest,
        @Param('id') id: string,
        @Param('year') year: number,
        @Param('month') month: number
    ): Promise<ResponseMovementDTO> {
        return await this.recurrenceService.toMovement(req.user.id, id, year, month)
    }

    @Get('/getAllByMonthYear/:year/:month')
    @ApiParam({
        name: 'year',
        required: true,
        type: Number,
        description: 'Ano da movimentação',
        example: new Date().getFullYear(),
    })
    @ApiParam({
        name: 'month',
        required: true,
        type: Number,
        description: 'Mês da movimentação',
        example: new Date().getMonth() + 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Retorna uma lista de movimentações do mês/ano solicitado agrupados por recorrência com sucesso',
    })
    async getAllByMonthYear(
        @Request() req: CustomUserRequest,
        @Param('year') year: number,
        @Param('month') month: number
    ) {
        return await this.recurrenceService.getAllByMonthYear(req.user.id, month, year)
    }

    @Get('/getAll')
    @ApiResponse({
        status: 200,
        description: 'Retorna uma lista de movimentações do mês/ano solicitado agrupados por recorrência com sucesso',
    })
    async getAll(@Request() req: CustomUserRequest) {
        return await this.recurrenceService.getAll(req.user.id)
    }
}
