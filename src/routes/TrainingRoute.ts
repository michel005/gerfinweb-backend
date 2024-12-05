import express from 'express'
import { TrainingCreateRequest } from './training/TrainingCreateRequest'
import { TrainingUpdateRequest } from './training/TrainingUpdateRequest'
import { TrainingRemoveRequest } from './training/TrainingRemoveRequest'
import { TrainingGetByIdRequest } from './training/TrainingGetByIdRequest'
import { TrainingGetAllRequest } from './training/TrainingGetAllRequest'

export const TrainingRoute = express
    .Router()
    .get('/training', TrainingGetAllRequest)
    .get('/training/byId', TrainingGetByIdRequest)
    .post('/training', TrainingCreateRequest)
    .put('/training', TrainingUpdateRequest)
    .delete('/training', TrainingRemoveRequest)
