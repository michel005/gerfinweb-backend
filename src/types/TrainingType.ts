import { DatabaseEntity } from './database/DatabaseEntity'

export type TimeExecutionPlan = {
    target_time?: string
}

export type SeriesExecutionPlan = {
    total_series?: number
    resting_time?: string
}

export type RepetitionExecutionPlan = {
    total_series?: number
    total_repetitions?: number
    resting_time?: string
}

export type DistanceExecutionPlan = {
    target_time?: number
    distance?: number
    distance_unit_measure?: string
}

export type ExerciseType = DatabaseEntity<{
    order?: number
    user_id?: string
    training_id?: string
    name?: string
    description?: string
    measure_type?: 'TIME' | 'SERIES' | 'REPETITIONS' | 'DISTANCE'
    execution_plan:
        | TimeExecutionPlan
        | SeriesExecutionPlan
        | RepetitionExecutionPlan
        | DistanceExecutionPlan
    drops?: number
}>

export type TrainingType = DatabaseEntity<{
    user_id?: string
    name?: string
    expiration_date?: string
    status?: 'OPEN' | 'ARCHIVED' | 'CLOSED' | 'EXPIRED'
    weekday?: number
}>
