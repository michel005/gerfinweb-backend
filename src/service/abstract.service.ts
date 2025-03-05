import { Model } from 'mongoose'
import { AbstractEntityDto } from '../dto/abstractEntity.dto'
import { DateUtils } from '../utils/date.utils'

export abstract class AbstractService<Entity extends AbstractEntityDto> {
    constructor(protected readonly model: Model<Entity>) {}

    public abstract validateCreate(entity: any)
    public abstract validateUpdate(entity: any)
    public parseCreate(entity: any): any {
        return entity
    }
    public parseUpdate(entity: any): any {
        return entity
    }

    async create(data: Partial<Entity>): Promise<Entity> {
        this.validateCreate(data)
        data.created = DateUtils.dateTimeToString(new Date())
        const createdDoc = new this.model(this.parseCreate(data))
        return createdDoc.save()
    }

    async update(id: string, data: Partial<Entity>): Promise<Entity | null> {
        this.validateUpdate(data)
        data.updated = DateUtils.dateTimeToString(new Date())
        return this.model
            .findByIdAndUpdate(id, this.parseUpdate(data), { new: true })
            .exec()
    }

    async delete(id: string): Promise<Entity | null> {
        return this.model.findByIdAndDelete(id).exec()
    }
}
