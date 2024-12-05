import express, { Express } from 'express'
import cors from 'cors'
import { PingRoute } from './routes/PingRoute'
import { UserRoute } from './routes/UserRoute'
import { AuthenticationMiddleware } from './middleware/AuthenticationMiddleware'
import { UserType } from './types/UserType'
import { TrainingRoute } from './routes/TrainingRoute'
import { ExerciseRoute } from './routes/ExerciseRoute'

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserType
        }
    }
}

const exp: Express = express()
exp.use(cors())
exp.use(AuthenticationMiddleware)
exp.use(express.json({ limit: '10mb' }))
exp.use(express.urlencoded({ extended: true, limit: '10mb' }))
exp.use(
    '/api',
    express
        .Router()
        .use(PingRoute())
        .use(UserRoute)
        .use(TrainingRoute)
        .use(ExerciseRoute)
)

exp.listen(8080, () => {
    console.log('Up at port 8080')
})
