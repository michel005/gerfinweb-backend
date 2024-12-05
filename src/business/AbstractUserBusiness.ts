import { DatabaseEntity } from '../types/database/DatabaseEntity'
import { Database } from '../database/Database'
import { ErrorCollection, ErrorType } from '../types/ErrorCollection'
import { UserType } from '../types/UserType'

export abstract class AbstractUserBusiness<T extends DatabaseEntity> {
    public database: Database<T>

    constructor(tableName: string) {
        this.database = new Database<T>(tableName)
    }

    public abstract validateCreate: ({ entity }: { entity: any }) => void
    public abstract validateUpdate: ({ entity }: { entity: any }) => void
    public abstract parseSave: ({ entity }: { entity: any }) => any
    public abstract parseResponse: ({
        entity,
        currentUser,
    }: {
        entity: any
        currentUser: UserType
    }) => any

    public create = ({
        currentUser,
        entity,
    }: {
        currentUser: UserType
        entity: any
    }) => {
        this.validateCreate({ entity })

        const valueToSave = this.parseSave({
            entity: JSON.parse(JSON.stringify(entity)),
        })
        const response = this.database.save({
            ...valueToSave,
            user_id: currentUser.id,
        })

        return this.parseResponse({ entity: response, currentUser })
    }

    public update = ({
        currentUser,
        id,
        entity,
    }: {
        currentUser: UserType
        id: string
        entity: any
    }) => {
        this.validateUpdate({ entity })

        const valueToSave = this.parseSave({
            entity: JSON.parse(JSON.stringify(entity)),
        })
        const databaseEntity: any = this.database.find(
            (x: any) => x.id === id && x.user_id === currentUser.id
        )?.[0]
        if (!databaseEntity) {
            ErrorCollection.simple('error', 'VALIDATION-002')
        }
        const response = this.database.save({
            ...databaseEntity,
            ...valueToSave,
            user_id: currentUser.id,
        })

        return this.parseResponse({ entity: response, currentUser })
    }

    public remove = ({
        currentUser,
        id,
    }: {
        currentUser: UserType
        id: string
    }) => {
        const databaseEntity: any = this.database.find(
            (x: any) => x.id === id && x.user_id === currentUser.id
        )?.[0]
        if (!databaseEntity) {
            ErrorCollection.simple('error', 'VALIDATION-002')
        }
        this.database.remove(id)
    }
}
