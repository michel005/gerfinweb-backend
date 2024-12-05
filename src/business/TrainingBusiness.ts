import { UserType } from '../types/UserType'
import { ErrorCollection } from '../types/ErrorCollection'
import { TrainingType } from '../types/TrainingType'
import { AbstractUserBusiness } from './AbstractUserBusiness'
import { Business } from './Business'
import { SortUtils } from '../utils/SortUtils'
import { DateUtils } from '../utils/DateUtils'

export class TrainingBusiness extends AbstractUserBusiness<TrainingType> {
    constructor() {
        super('training')
    }

    private validate = ({
        errors,
        entity,
    }: {
        errors: ErrorCollection
        entity: any
    }) => {
        if (!entity.name) {
            errors.add('name', 'VALIDATION-001')
        }
        if (!entity.expiration_date) {
            errors.add('expiration_date', 'VALIDATION-001')
        }
        if (!entity.status) {
            errors.add('status', 'VALIDATION-001')
        }
    }

    public validateCreate = ({ entity }: { entity: any }) => {
        const errors = new ErrorCollection()
        this.validate({ errors, entity })
        errors.throw()
    }

    public validateUpdate = ({ entity }: { entity: any }) => {
        const errors = new ErrorCollection()
        this.validate({ errors, entity })
        errors.throw()
    }

    public parseSave = ({ entity }: { entity: any }) => {
        return {
            name: entity.name,
            expiration_date: entity.expiration_date,
            weekday: entity.weekday,
            status:
                entity.status === 'EXPIRED' &&
                DateUtils.stringToDate(entity.expiration_date).getTime() >=
                    new Date().getTime()
                    ? 'OPEN'
                    : entity.status,
        }
    }

    public parseResponse = ({
        entity,
        currentUser,
    }: {
        entity: any
        currentUser: UserType
    }) => {
        return {
            ...entity,
            exercises: Business.exercise
                .getByTrainingId({
                    trainingId: entity.id,
                    currentUser,
                })
                .sort((x: any, y: any) => SortUtils.sort(x, y, 'order')),
            status:
                DateUtils.stringToDate(entity.expiration_date).getTime() <
                new Date().getTime()
                    ? 'EXPIRED'
                    : entity.status,
            user_id: undefined,
        }
    }

    public getById = ({
        currentUser,
        id,
    }: {
        currentUser: UserType
        id: string
    }) => {
        const training = this.database.find(
            (x) => x.user_id === currentUser.id && x.id === id
        )?.[0]

        if (training) {
            return this.parseResponse({
                entity: training,
                currentUser,
            })
        } else {
            return null
        }
    }

    public getAll = ({ currentUser }: { currentUser: UserType }) => {
        return this.database
            .find((x) => x.user_id === currentUser.id)
            .map((x) => {
                return this.parseResponse({
                    entity: x,
                    currentUser,
                })
            })
            .sort((x, y) => SortUtils.sort(x, y, 'weekday', 'ASC'))
    }
}
