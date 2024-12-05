import { UserType } from '../types/UserType'
import { ErrorCollection } from '../types/ErrorCollection'
import { ExerciseType, TrainingType } from '../types/TrainingType'
import { AbstractUserBusiness } from './AbstractUserBusiness'
import { Business } from './Business'
import { SortUtils } from '../utils/SortUtils'

export class ExerciseBusiness extends AbstractUserBusiness<ExerciseType> {
    constructor() {
        super('exercise')
    }

    private validate = ({
        errors,
        entity,
    }: {
        errors: ErrorCollection
        entity: any
    }) => {
        if (!entity.training_id) {
            errors.add('training_id', 'VALIDATION-001')
        }
        if (!entity.order) {
            errors.add('order', 'VALIDATION-001')
        }
        if (!entity.name) {
            errors.add('name', 'VALIDATION-001')
        }
        if (!entity.measure_type) {
            errors.add('measure_type', 'VALIDATION-001')
        } else {
            if (
                !['TIME', 'SERIES', 'REPETITIONS', 'DISTANCE'].includes(
                    entity.measure_type
                )
            ) {
                errors.add('measure_type', 'VALIDATION-001')
            }
        }
        if (!entity.execution_plan) {
            errors.add('execution_plan', 'VALIDATION-001')
        } else {
            if (entity.measure_type === 'TIME') {
                if (!entity.execution_plan.target_time) {
                    errors.add('execution_plan.target_time', 'VALIDATION-001')
                }
            }
            if (entity.measure_type === 'SERIES') {
                if (!entity.execution_plan.total_series) {
                    errors.add('execution_plan.total_series', 'VALIDATION-001')
                }
            }
            if (entity.measure_type === 'REPETITIONS') {
                if (!entity.execution_plan.total_series) {
                    errors.add('execution_plan.total_series', 'VALIDATION-001')
                }
                if (!entity.execution_plan.total_repetitions) {
                    errors.add(
                        'execution_plan.total_repetitions',
                        'VALIDATION-001'
                    )
                }
            }
            if (entity.measure_type === 'DISTANCE') {
                if (!entity.execution_plan.target_time) {
                    errors.add('execution_plan.target_time', 'VALIDATION-001')
                }
                if (!entity.execution_plan.distance) {
                    errors.add('execution_plan.distance', 'VALIDATION-001')
                }
                if (!entity.execution_plan.distance_unit_measure) {
                    errors.add(
                        'execution_plan.distance_unit_measure',
                        'VALIDATION-001'
                    )
                }
            }
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
        const execution_plan: any = {}
        if (entity.measure_type === 'TIME') {
            execution_plan.target_time = entity.execution_plan.target_time
        }
        if (entity.measure_type === 'SERIES') {
            execution_plan.total_series = entity.execution_plan.total_series
            execution_plan.resting_time = entity.execution_plan.resting_time
        }
        if (entity.measure_type === 'REPETITIONS') {
            execution_plan.total_series = entity.execution_plan.total_series
            execution_plan.total_repetitions =
                entity.execution_plan.total_repetitions
            execution_plan.resting_time = entity.execution_plan.resting_time
        }
        if (entity.measure_type === 'DISTANCE') {
            execution_plan.target_time = entity.execution_plan.target_time
            execution_plan.distance = entity.execution_plan.distance
            execution_plan.distance_unit_measure =
                entity.execution_plan.distance_unit_measure
        }
        return {
            training_id: entity.training_id,
            order: entity.order,
            name: entity.name,
            description: entity.description,
            measure_type: entity.measure_type,
            drops: entity.drops,
            execution_plan,
        }
    }

    public parseResponse = ({
        currentUser,
        entity,
    }: {
        currentUser: UserType
        entity: any
    }) => {
        let allExercises = this.getByTrainingId({
            currentUser,
            trainingId: entity.training_id,
        })
        allExercises = allExercises
            .sort((x: any, y: any) => SortUtils.sort(x, y, 'order'))
            .map((x: any, index: number) => {
                return {
                    ...x,
                    order: (index + 1) * 10,
                }
            })

        let responseEntity = null
        for (const exercise of allExercises) {
            if (exercise.id === entity.id) {
                responseEntity = exercise
            }
            this.database.save({
                user_id: currentUser.id,
                ...exercise,
            })
        }

        return {
            ...responseEntity,
            user_id: undefined,
        }
    }

    public getByTrainingId = ({
        currentUser,
        trainingId,
    }: {
        currentUser: UserType
        trainingId: string
    }): any => {
        return this.database.find(
            (x) => x.user_id === currentUser.id && x.training_id === trainingId
        )
    }
}
