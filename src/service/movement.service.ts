import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Movement } from '../schema/movement.schema'
import { DateUtils } from '../utils/date.utils'
import { ErrorCollection } from '../utils/ErrorUtils'
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

    async findAll(
        userId: string,
        month: string,
        year: string,
        search: string
    ): Promise<Movement[]> {
        const filter = {
            user: userId,
            $or: [
                { description: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
                { dueDate: { $regex: search, $options: 'i' } },
            ],
        }
        if (month && year) {
            filter['date'] = {
                $regex: new RegExp(
                    `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                ),
            }
        }
        return (
            await this.movementModel
                .find(filter)
                .populate('originAccountDetails')
                .populate('destinyAccountDetails')
                .populate('templateDetails')
                .exec()
        ).map((x) => {
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
