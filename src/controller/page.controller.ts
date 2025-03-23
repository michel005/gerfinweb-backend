import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common'
import { MovementService } from 'src/service/movement.service'
import { TemplateService } from 'src/service/template.service'
import { AuthGuard, CustomRequest } from '../guards/AuthGuard'

@Controller('pages')
export class PageController {
    constructor(
        private readonly movementService: MovementService,
        private readonly templateService: TemplateService
    ) {}

    @Get('/home')
    @UseGuards(AuthGuard)
    async home(
        @Request() req: CustomRequest,
        @Query('month') month: number,
        @Query('year') year: number
    ) {
        const movementList = await this.movementService.findAll(
            req.user._id,
            month.toString(),
            year.toString()
        )
        const before = await this.movementService.amount(
            req.user._id,
            (month === 1 ? 12 : month - 1).toString(),
            (month === 1 ? year - 1 : year).toString()
        )
        const current = await this.movementService.amount(
            req.user._id,
            month.toString(),
            year.toString()
        )
        return {
            currentAmount: current.current,
            futureAmount:
                before.future +
                movementList
                    .filter((x) => x.type === 'MOVEMENT')
                    .map((x) => x.value)
                    .reduce((x, y) => x + y, 0),
            credits: movementList
                .filter((x) => x.type === 'MOVEMENT' && x.value > 0)
                .map((x) => x.value)
                .reduce((x, y) => x + y, 0),
            debits: movementList
                .filter((x) => x.type === 'MOVEMENT' && x.value < 0)
                .map((x) => x.value)
                .reduce((x, y) => x + y, 0),
            pendent: movementList.filter((x) =>
                ['PENDENT', 'LATE'].includes(x.status)
            ),
            dailyAmount: await this.movementService.dailyAmount(
                req.user._id,
                month,
                year
            ),
        }
    }

    @Get('/movements')
    @UseGuards(AuthGuard)
    async movements(
        @Request() req: CustomRequest,
        @Query('month') month: number,
        @Query('year') year: number
    ) {
        const movementList = await this.movementService.findAll(
            req.user._id,
            month.toString(),
            year.toString()
        )

        const before = await this.movementService.amount(
            req.user._id,
            (month === 1 ? 12 : month - 1).toString(),
            (month === 1 ? year - 1 : year).toString()
        )
        return {
            notUsedTemplates: (
                await this.templateService.findAllWithMovementCount(
                    req.user._id,
                    month.toString(),
                    year.toString()
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
