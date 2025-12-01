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
import { TemplateService } from 'src/service/template.service'
import { AuthGuard, CustomRequest } from '../guards/AuthGuard'
import { Movement } from '../schema/movement.schema'
import { MovementService } from '../service/movement.service'

@Controller('movements')
export class MovementController {
    constructor(
        private readonly movementService: MovementService,
        private readonly templateService: TemplateService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Request() req: CustomRequest, @Body() body: Movement) {
        return this.movementService.create({
            ...body,
            user: req.user._id,
        })
    }

    @Put()
    @UseGuards(AuthGuard)
    update(
        @Request() req: CustomRequest,
        @Query('id') id: string,
        @Body() body: Movement
    ) {
        return this.movementService.update(id, {
            user: req.user._id,
            date: body.date,
            dueDate: body.dueDate,
            description: body.description,
            type: body.type,
            originAccount: body.originAccount,
            destinyAccount: body.destinyAccount,
            value: body.value,
            template: body.template,
        })
    }

    @Delete()
    @UseGuards(AuthGuard)
    delete(@Request() req: CustomRequest, @Query('id') id: string) {
        return this.movementService.delete(id)
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(
        @Request() req: CustomRequest,
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        return this.movementService.findAll(req.user._id, month, year)
    }

    @Get('/amount')
    @UseGuards(AuthGuard)
    amount(
        @Request() req: CustomRequest,
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        return this.movementService.amount(req.user._id, month, year)
    }

    @Get('/page')
    @UseGuards(AuthGuard)
    async page(
        @Request() req: CustomRequest,
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        const numberMonth = parseInt(month)
        const numberYear = parseInt(year)

        const movementList = await this.movementService.findAll(
            req.user._id,
            month,
            year
        )

        const before = await this.movementService.amount(
            req.user._id,
            (numberMonth === 1 ? 12 : numberMonth - 1).toString(),
            (numberMonth === 1 ? numberYear - 1 : numberYear).toString()
        )
        return {
            notUsedTemplates: (
                await this.templateService.findAllWithMovementCount(
                    req.user._id,
                    month,
                    year
                )
            ).filter(
                (x) =>
                    x.movementCount === 0 || x.recurrence === 'MANY_PER_MONTH'
            ),
            movements: movementList,
            amountBefore: before.future,
            amountAfter:
                before.future +
                movementList
                    .filter((x) => x.type === 'MOVEMENT')
                    .map((x) => x.value)
                    .reduce((x, y) => x + y, 0),
        }
    }
}
