import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { AbstractEntityDto } from '../dto/abstractEntity.dto'

@Schema()
export class Movement extends AbstractEntityDto {
    @Prop({ default: uuidv4 })
    _id: string

    @Prop({ required: true })
    date: string

    @Prop()
    dueDate: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    type: 'MOVEMENT' | 'TRANSFER'

    @Prop({ type: 'string', ref: 'Account' })
    originAccount: string

    @Prop({ type: 'string', ref: 'Account', required: true })
    destinyAccount: string

    @Prop({ required: true })
    value: number

    @Prop({ type: 'string', ref: 'User', required: true })
    user: string

    @Prop({ select: false })
    status: string

    @Prop({ type: 'string', ref: 'Template' })
    template: string
}

const MovementSchema = SchemaFactory.createForClass(Movement)
MovementSchema.set('toJSON', { virtuals: true })
MovementSchema.set('toObject', { virtuals: true })
MovementSchema.virtual('originAccountDetails', {
    ref: 'Account',
    localField: 'originAccount',
    foreignField: '_id',
    justOne: true,
})

MovementSchema.virtual('destinyAccountDetails', {
    ref: 'Account',
    localField: 'destinyAccount',
    foreignField: '_id',
    justOne: true,
})

MovementSchema.virtual('templateDetails', {
    ref: 'Template',
    localField: 'template',
    foreignField: '_id',
    justOne: true,
})
export { MovementSchema }
