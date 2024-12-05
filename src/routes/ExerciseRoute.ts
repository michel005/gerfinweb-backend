import express from 'express'
import { ExerciseGetAllRequest } from './exercise/ExerciseGetAllRequest'
import { ExerciseCreateRequest } from './exercise/ExerciseCreateRequest'
import { ExerciseUpdateRequest } from './exercise/ExerciseUpdateRequest'
import { ExerciseRemoveRequest } from './exercise/ExerciseRemoveRequest'
import { DefaultRoute } from './DefaultRoute'

export const ExerciseRoute = express
    .Router()
    .get('/exercise', ExerciseGetAllRequest)
    .post('/exercise', ExerciseCreateRequest)
    .put('/exercise', ExerciseUpdateRequest)
    .delete('/exercise', ExerciseRemoveRequest)
