import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { AbstractEntityDto } from '../dto/abstractEntity.dto'

@Schema()
export class User extends AbstractEntityDto {
    @Prop({ default: uuidv4 })
    _id: string

    @Prop()
    picture: string

    @Prop({ required: true })
    fullName: string

    @Prop()
    biography: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop()
    birthday: string

    @Prop({ required: true })
    password: string

    @Prop()
    colorSchema: string
}

export const UserSchema = SchemaFactory.createForClass(User)
