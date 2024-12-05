import { randomUUID } from 'node:crypto'
import DatabaseConfig from '../../database.json'
import fileStream from 'fs'
import path from 'path'
import { DatabaseEntity } from '../types/database/DatabaseEntity'
import { ErrorCollection } from '../types/ErrorCollection'
import { DateUtils } from '../utils/DateUtils'

export class Database<T> {
    private readonly _table: string

    constructor(table: string) {
        this._table = table

        if (!fileStream.existsSync(DatabaseConfig.local_file_path)) {
            fileStream.mkdirSync(DatabaseConfig.local_file_path)
        }
    }

    private getCurrentState: () => {
        [key: string]: DatabaseEntity<T>[]
    } = () => {
        let databaseContent: any
        try {
            databaseContent = String(
                fileStream.readFileSync(
                    path.join(DatabaseConfig.local_file_path, `database.json`)
                )
            )
        } catch (e) {
            databaseContent = JSON.stringify({ [this._table]: [] })
        }
        if (!databaseContent) {
            databaseContent = JSON.stringify({ [this._table]: [] })
        }
        return JSON.parse(databaseContent)
    }

    private updateCurrentState = (entity: DatabaseEntity<T>[]) => {
        const currentState = this.getCurrentState()
        fileStream.writeFileSync(
            path.join(DatabaseConfig.local_file_path, `database.json`),
            JSON.stringify(
                {
                    ...currentState,
                    [this._table]: entity,
                },
                null,
                2
            )
        )
    }

    public save = (entity: DatabaseEntity<T>) => {
        const content = this.getCurrentState()
        if (entity.id) {
            const foundedIndex = content[this._table].findIndex(
                (x) => x.id === entity.id
            )
            if (foundedIndex !== -1) {
                content[this._table][foundedIndex] = {
                    ...entity,
                    id: entity.id,
                    save_date: DateUtils.dateTimeToString(new Date()),
                }
            } else {
                ErrorCollection.simple('error', 'VALIDATION-002')
            }
        } else {
            entity.id = randomUUID()
            entity.save_date = DateUtils.dateTimeToString(new Date())

            if (!content[this._table]) {
                content[this._table] = []
            }

            content[this._table].push(entity)
        }

        this.updateCurrentState(content[this._table])

        return JSON.parse(JSON.stringify(entity)) as DatabaseEntity<T>
    }

    public remove = (id?: string) => {
        const content = this.getCurrentState()
        const foundedIndex = (content?.[this._table] || []).findIndex(
            (x) => x.id === id
        )
        if (foundedIndex !== -1) {
            ;(content?.[this._table] || []).splice(foundedIndex, 1)
        } else {
            throw Error(`[${this._table}] Entity not found!`)
        }

        this.updateCurrentState(content?.[this._table] || [])
    }

    public find = (...query: ((entity: T) => boolean)[]) => {
        let current: T[] = this.getCurrentState()?.[this._table] || []
        for (const q of query) {
            current = (current.filter(q) as any) || []
        }

        return current
    }
}
