import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { AbstractEntityDto } from '../dto/abstractEntity.dto'

@Schema()
export class Token extends AbstractEntityDto {
    @Prop({ default: uuidv4 })
    _id: string

    @Prop({ required: true })
    token: string

    @Prop({ type: 'string', ref: 'User', required: true })
    user: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)
