import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Movement } from '../schema/movement.schema'
import { ArrayUtils } from '../utils/array.utils'
import { DateUtils } from '../utils/date.utils'
import { ErrorCollection } from '../utils/ErrorUtils'
import { MyDate } from '../utils/MyDate'
import { AbstractService } from './abstract.service'

@Injectable()
export class MovementService extends AbstractService<Movement> {
    constructor(
        @InjectModel(Movement.name) private movementModel: Model<Movement>
    ) {
        super(movementModel)
    }

    commonValidation(entity: any) {
        const errors = new ErrorCollection()
        errors.addNullValidation('date', entity.date)
        errors.addNullValidation('description', entity.description)
        errors.addNullValidation('value', entity.value)
        errors.addNullValidation('type', entity.type)
        if (!errors.hasField('type')) {
            errors.add(
                'type',
                'MOVEMENT-001',
                !['MOVEMENT', 'TRANSFER'].includes(entity.type)
            )
        }
        if (!errors.hasField('type')) {
            if (entity.type === 'TRANSFER') {
                errors.addNullValidation('originAccount', entity.originAccount)
            }
            errors.addNullValidation('destinyAccount', entity.destinyAccount)
        }
        if (
            entity.type === 'TRANSFER' &&
            !errors.hasField('originAccount') &&
            !errors.hasField('destinyAccount')
        ) {
            errors.add(
                'originAccount',
                'MOVEMENT-002',
                entity.originAccount === entity.destinyAccount
            )
        }
        if (entity.dueDate) {
            errors.add(
                'dueDate',
                'MOVEMENT-003',
                DateUtils.stringToDate(entity.dueDate).getTime() >
                    DateUtils.stringToDate(
                        DateUtils.dateToString(new Date())
                    ).getTime()
            )
        }
        errors.throw()
    }

    validateCreate(entity: any) {
        this.commonValidation(entity)
    }

    validateUpdate(entity: any) {
        this.commonValidation(entity)
    }

    private status(x: Movement) {
        if (!!x.dueDate && x.dueDate !== '') {
            if (
                DateUtils.stringToDate(x.dueDate).getTime() <=
                DateUtils.stringToDate(x.date).getTime()
            ) {
                return 'APPROVED'
            } else {
                return 'APPROVED_LATE'
            }
        } else {
            if (
                new Date().getTime() > DateUtils.stringToDate(x.date).getTime()
            ) {
                return 'LATE'
            }
        }
        return 'PENDENT'
    }

    async dailyAmount(
        userId: string,
        month: number,
        year: number
    ): Promise<{
        current: { day: number; amount?: number }[]
        future: { day: number; amount?: number }[]
    }> {
        const movementList = await this.findAll(
            userId,
            month.toString(),
            year.toString()
        )
        const before = await this.amount(
            userId,
            (month === 1 ? 12 : month - 1).toString(),
            (month === 1 ? year - 1 : year).toString()
        )

        const currentDays: {
            day: number
            amount?: number
        }[] = []
        const futureDays: {
            day: number
            amount?: number
        }[] = []
        const amount = movementList.filter((x) => x.type === 'MOVEMENT')
        for (const day of new Array(DateUtils.lastDay(month, year))
            .fill(null)
            .map((_, x) => x + 1)) {
            if (new MyDate(day, month, year).compare(new MyDate()) < 0) {
                currentDays.push({
                    day,
                    amount:
                        ArrayUtils.sum(
                            amount.filter(
                                (x) =>
                                    MyDate.fromString(x.dueDate || '').compare(
                                        new MyDate(day, month, year)
                                    ) <= 0
                            ),
                            'value'
                        ) + before.current,
                })
                futureDays.push({
                    day,
                })
            } else if (
                new MyDate(day, month, year).compare(new MyDate()) === 0
            ) {
                currentDays.push({
                    day,
                    amount:
                        ArrayUtils.sum(
                            amount.filter(
                                (x) =>
                                    MyDate.fromString(x.dueDate || '').compare(
                                        new MyDate(day, month, year)
                                    ) <= 0
                            ),
                            'value'
                        ) + before.current,
                })
                futureDays.push({
                    day,
                    amount:
                        ArrayUtils.sum(
                            amount.filter(
                                (x) =>
                                    MyDate.fromString(
                                        x.dueDate || x.date || ''
                                    ).compare(new MyDate(day, month, year)) <= 0
                            ),
                            'value'
                        ) + before.future,
                })
            } else {
                futureDays.push({
                    day,
                    amount:
                        ArrayUtils.sum(
                            amount.filter(
                                (x) =>
                                    MyDate.fromString(
                                        x.dueDate || x.date || ''
                                    ).compare(new MyDate(day, month, year)) <= 0
                            ),
                            'value'
                        ) + before.future,
                })
            }
        }

        return {
            current: currentDays,
            future: futureDays,
        }
    }

    async findAll(
        userId: string,
        month: string,
        year: string
    ): Promise<Movement[]> {
        const filter = {
            user: userId,
            $or: [
                {
                    date: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                },
                {
                    dueDate: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                },
            ],
        }
        return (
            await this.movementModel
                .find(filter)
                .populate('originAccountDetails')
                .populate('destinyAccountDetails')
                .populate('templateDetails')
                .exec()
        ).map((x) => {
            console.log({ x })
            x.status = this.status(x)
            return x
        })
    }

    async findAllByTemplate(
        userId: string,
        templateId: string,
        month: string,
        year: string
    ): Promise<Movement[]> {
        const filter = {
            user: userId,
            template: templateId,
            $or: [
                {
                    date: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                },
                {
                    dueDate: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                },
            ],
        }
        return (
            await this.movementModel
                .find(filter)
                .populate('originAccountDetails')
                .populate('destinyAccountDetails')
                .populate('templateDetails')
                .exec()
        ).map((x) => {
            console.log({ x })

            x.status = this.status(x)
            return x
        })
    }

    async findAllWithNoTemplate(
        userId: string,
        month: string,
        year: string
    ): Promise<Movement[]> {
        const filter = {
            user: userId,
            template: { $exists: false },
            $or: [
                {
                    date: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                },
                {
                    dueDate: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                },
            ],
        }
        return (
            await this.movementModel
                .find(filter)
                .populate('originAccountDetails')
                .populate('destinyAccountDetails')
                .populate('templateDetails')
                .exec()
        ).map((x) => {
            console.log({ x })
            x.status = this.status(x)
            return x
        })
    }

    async amount(
        userId: string,
        month: string,
        year: string
    ): Promise<{
        current: number
        future: number
    }> {
        const allMovements = (
            await this.movementModel
                .find({
                    user: userId,
                    type: { $ne: 'TRANSFER' },
                })
                .exec()
        ).filter((x) => {
            const date = x.dueDate || x.date
            const movementMonthYear =
                DateUtils.stringToDate(date).getFullYear() * 12 +
                (DateUtils.stringToDate(date).getMonth() + 1)
            const paramMonthYear = parseInt(year) * 12 + parseInt(month)
            return movementMonthYear <= paramMonthYear
        })

        return {
            current: allMovements
                .filter((x) => !!x.dueDate)
                .map((x) => x.value)
                .reduce((x, y) => x + y, 0),
            future: allMovements.map((x) => x.value).reduce((x, y) => x + y, 0),
        }
    }
}
