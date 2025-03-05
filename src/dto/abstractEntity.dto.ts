import { Prop } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'

export class AbstractEntityDto extends Document {
    @Prop()
    created: string

    @Prop()
    updated: string
}
