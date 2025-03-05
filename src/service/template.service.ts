import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Movement } from '../schema/movement.schema'
import { Template } from '../schema/template.schema'
import { DateUtils } from '../utils/date.utils'
import { ErrorCollection } from '../utils/ErrorUtils'
import { AbstractService } from './abstract.service'

@Injectable()
export class TemplateService extends AbstractService<Template> {
    constructor(
        @InjectModel(Template.name) private templateModel: Model<Template>,
        @InjectModel(Movement.name) private movementModel: Model<Movement>
    ) {
        super(templateModel)
    }

    commonValidation(entity: any) {
        const errors = new ErrorCollection()
        errors.throw()
    }

    validateCreate(entity: any) {
        this.commonValidation(entity)
    }

    validateUpdate(entity: any) {
        this.commonValidation(entity)
    }

    async findAll(userId: string, search: string): Promise<Template[]> {
        return await this.templateModel
            .find({
                user: userId,
                $or: [
                    { description: { $regex: search, $options: 'i' } },
                    { recurrence: { $regex: search, $options: 'i' } },
                ],
            })
            .populate('destinyAccountDetails')
            .exec()
    }

    async toMovement(
        userId: string,
        id: string,
        month: string,
        year: string
    ): Promise<
        Partial<
            Movement & {
                templateDetails: any
            }
        >
    > {
        const error = new ErrorCollection()
        const template = await this.templateModel
            .findOne({
                _id: id,
                user: userId,
            })
            .exec()

        error.add('error', 'VALIDATE-003', !template)
        error.throw()

        return {
            date: template?.day
                ? `${template.day}/${month.padStart(2, '0')}/${year}`
                : DateUtils.dateToString(new Date()),
            description: template?.description,
            destinyAccount: template?.destinyAccount,
            type: 'MOVEMENT',
            value: template?.value,
            template: template?._id,
            templateDetails: template,
        }
    }

    async findAllWithMovementCount(
        userId: string,
        month: string,
        year: string
    ) {
        const templates = await this.templateModel
            .find({
                user: userId,
            })
            .populate('destinyAccountDetails')
            .exec()

        return await Promise.all(
            templates.map(async (template) => {
                const count = await this.movementModel.countDocuments({
                    template: template._id,
                    user: userId,
                    date: {
                        $regex: new RegExp(
                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                        ),
                    },
                })
                return { ...template.toObject(), movementCount: count }
            })
        )
    }
}
