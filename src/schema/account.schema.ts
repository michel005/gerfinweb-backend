import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { AbstractEntityDto } from '../dto/abstractEntity.dto'

@Schema()
export class Account extends AbstractEntityDto {
    @Prop({ default: uuidv4 })
    _id: string

    @Prop({ required: true })
    name: string

    @Prop()
    agencyNumber: string

    @Prop()
    accountNumber: string

    @Prop()
    pixCode: string

    @Prop({ required: true })
    type: 'DEBIT' | 'CREDIT' | 'INVESTMENTS' | 'SAVINGS'

    @Prop({ type: 'string', ref: 'User', required: true })
    user: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
