import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request } from '@nestjs/common'
import {
    CreateMovementDTO,
    RecurrencesMovementByMonthYearDTO,
    ResponseMovementDTO,
    ResponseMovementListDTO,
    UpdateMovementDTO,
} from '@/feature/movement/dto'
import { CustomUserRequest } from '@/type/CustomUserRequest'
import { AbstractPrivateController } from '@/feature/AbstractPrivateController'

@ApiTags('Movement')
@Controller('/movement')
export class MovementController extends AbstractPrivateController {
    @Post('/create')
    @ApiResponse({
        status: 200,
        description: 'Cadastra uma movimentação com sucesso',
        type: ResponseMovementDTO,
    })
    async create(@Request() req: CustomUserRequest, @Body() movement: CreateMovementDTO) {
        return this.movementService.create(req.user.id, movement)
    }

    @Put('/:id/update')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da movimentação',
    })
    @ApiResponse({
        status: 200,
        description: 'Atualiza uma movimentação com sucesso',
        type: ResponseMovementDTO,
    })
    async update(
        @Request() req: CustomUserRequest,
        @Param('id') id: string,
        @Body() movement: UpdateMovementDTO
    ): Promise<ResponseMovementDTO> {
        return await this.movementService.update(req.user.id, id, movement)
    }

    @Patch('/:id/approve')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da movimentação',
    })
    @ApiResponse({
        status: 200,
        description: 'Aprova uma movimentação com sucesso',
        type: ResponseMovementDTO,
    })
    async approve(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<ResponseMovementDTO> {
        return await this.movementService.approve(req.user.id, id)
    }

    @Delete('/:id/delete')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'ID da movimentação',
    })
    @ApiResponse({
        status: 200,
        description: 'Deleta uma movimentação com sucesso',
        type: ResponseMovementDTO,
    })
    async delete(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<void> {
        await this.movementService.delete(req.user.id, id)
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
        type: ResponseMovementDTO,
    })
    async detail(@Request() req: CustomUserRequest, @Param('id') id: string): Promise<ResponseMovementDTO> {
        return await this.movementService.detail(req.user.id, id)
    }

    @Get('/getByMonthYear/:year/:month')
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
        description: 'Retorna uma lista de movimentações do mês/ano solicitado com sucesso',
        type: ResponseMovementListDTO,
    })
    async getByMonthYear(
        @Request() req: CustomUserRequest,
        @Param('year') year: number,
        @Param('month') month: number
    ): Promise<ResponseMovementListDTO> {
        return await this.movementService.getByMonthYear(req.user.id, month, year)
    }

    @Get('/getRecurrencyByMonthYear/:year/:month')
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
        type: RecurrencesMovementByMonthYearDTO,
    })
    async getByRecurrencesByMonthYear(
        @Request() req: CustomUserRequest,
        @Param('year') year: number,
        @Param('month') month: number
    ): Promise<RecurrencesMovementByMonthYearDTO> {
        return await this.movementService.getByRecurrencesByMonthYear(req.user.id, month, year)
    }
}
