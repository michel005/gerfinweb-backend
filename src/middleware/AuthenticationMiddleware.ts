import { NextFunction, Request, Response } from 'express'
import { SessionUtils } from '../utils/SessionUtils'
import { ErrorCollection } from '../types/ErrorCollection'
import { DefaultRouterResolver } from '../routes/DefaultRouterResolver'
import { Business } from '../business/Business'
import { Database } from '../database/Database'

const publicRoutes = [
    ['GET', '/api/ping'],
    ['POST', '/api/user/login'],
    ['POST', '/api/user'],
    ['GET', '/api/user/recovery/send'],
    ['GET', '/api/user/recovery/code'],
    ['GET', '/api/user/recovery/changePassword'],
]

export const AuthenticationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await DefaultRouterResolver(
        res,
        async () => {
            if (
                publicRoutes.find(
                    (x) => x[0] === req.method && x[1] === req.path
                )
            ) {
                next()
            } else {
                const token = SessionUtils.tokenByRequest(req)

                const user = await Database.prismaClient.user.findFirst({
                    select: Business.user.select,
                    where: {
                        user_token: {
                            some: {
                                token,
                            },
                        },
                    },
                })

                if (token && !!user) {
                    req.currentUser = user

                    if (req.currentUser) {
                        next()
                        return
                    }
                }

                ErrorCollection.simple('error', 'TOKEN-001')
            }
        },
        true
    )
}
