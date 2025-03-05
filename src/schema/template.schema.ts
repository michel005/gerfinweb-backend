import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { v4 as uuidv4 } from 'uuid'
import { AbstractEntityDto } from '../dto/abstractEntity.dto'

@Schema()
export class Template extends AbstractEntityDto {
    @Prop({ default: uuidv4 })
    _id: string

    @Prop()
    day: number

    @Prop({ required: true })
    description: string

    @Prop({ type: 'string', ref: 'Account' })
    destinyAccount: string

    @Prop()
    value: number

    @Prop({ required: true })
    recurrence: 'MANY_PER_MONTH' | 'ONE_PER_MONTH'

    @Prop({ type: 'string', ref: 'User', required: true })
    user: string
}

const TemplateSchema = SchemaFactory.createForClass(Template)
TemplateSchema.set('toJSON', { virtuals: true })
TemplateSchema.set('toObject', { virtuals: true })
TemplateSchema.virtual('destinyAccountDetails', {
    ref: 'Account',
    localField: 'destinyAccount',
    foreignField: '_id',
    justOne: true,
})
export { TemplateSchema }
