import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common'
import { MovementService } from 'src/service/movement.service'
import { TemplateService } from 'src/service/template.service'
import { AuthGuard, CustomRequest } from '../guards/AuthGuard'
import { AccountService } from '../service/account.service'
import { DateUtils } from 'src/utils/date.utils'

@Controller('pages')
export class PageController {
    constructor(
        private readonly accountService: AccountService,
        private readonly movementService: MovementService,
        private readonly templateService: TemplateService
    ) {}

    @Get('/home')
    @UseGuards(AuthGuard)
    async home(
        @Request() req: CustomRequest,
        @Query('month') month: number,
        @Query('year') year: number,
        @Query('amountChart') amountChart: string
    ) {
        const movementList = await this.movementService.findAll(
            req.user._id,
            month.toString(),
            year.toString(),
            ''
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

        const maxMin = {
            max: 0,
            min: 0,
        }
        const daily = new Array(DateUtils.lastDay(month, year))
            .fill(null)
            .map((_, index) => {
                const movementAmount =
                    movementList
                        ?.filter((x) => {
                            if (amountChart === 'current') {
                                return (
                                    x?.dueDate &&
                                    DateUtils.stringToDate(
                                        x?.dueDate
                                    ).getDate() <=
                                        index + 1
                                )
                            } else {
                                return (
                                    DateUtils.stringToDate(
                                        x?.dueDate || x?.date || ''
                                    ).getDate() <=
                                    index + 1
                                )
                            }
                        })
                        ?.filter((x) => x.type === 'MOVEMENT')
                        .map((x) => x.value || 0)
                        .reduce((x, y) => x + y, 0) +
                    (amountChart === 'current'
                        ? before.current || 0
                        : before.future || 0)
                if (maxMin.max < movementAmount) {
                    maxMin.max = movementAmount
                }
                if (maxMin.min > movementAmount) {
                    maxMin.min = movementAmount
                }
                return {
                    day: index + 1,
                    amount: movementAmount || 0,
                }
            })
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
            dailyAmount: {
                days: daily,
                min: maxMin.min,
                max: maxMin.max,
            },
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
            year.toString(),
            ''
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
