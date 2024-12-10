import express, { Express } from 'express'
import cors from 'cors'
import { PingRoute } from './routes/PingRoute'
import { UserRoute } from './routes/UserRoute'
import { AuthenticationMiddleware } from './middleware/AuthenticationMiddleware'
import { PrismaClient, user } from '@prisma/client'
import { Database } from './database/Database'

declare global {
    namespace Express {
        interface Request {
            currentUser: any
        }
    }
}
const prismaClient = new PrismaClient()
Database.prismaClient = prismaClient

const exp: Express = express()
exp.use(cors())
exp.use(AuthenticationMiddleware)
exp.use(express.json({ limit: '10mb' }))
exp.use(express.urlencoded({ extended: true, limit: '10mb' }))
exp.use('/api', express.Router().use(PingRoute()).use(UserRoute))

exp.listen(8080, () => {
    console.log('Up at port 8080')
    prismaClient.$connect().then(() => {
        console.log('Database connected!')
    })
})
