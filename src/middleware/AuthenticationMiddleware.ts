import { NextFunction, Request, Response } from 'express'
import { SessionUtils } from '../utils/SessionUtils'
import { ErrorCollection } from '../types/ErrorCollection'
import { DefaultRouterResolver } from '../routes/DefaultRouterResolver'
import { Business } from '../business/Business'

const publicRoutes = [
    ['GET', '/api/ping'],
    ['POST', '/api/user/login'],
    ['POST', '/api/user'],
    ['GET', '/api/user/recovery/send'],
    ['GET', '/api/user/recovery/code'],
    ['GET', '/api/user/recovery/changePassword'],
]

export const AuthenticationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    DefaultRouterResolver(
        res,
        () => {
            if (
                publicRoutes.find(
                    (x) => x[0] === req.method && x[1] === req.path
                )
            ) {
                next()
            } else {
                const token = SessionUtils.tokenByRequest(req)

                if (token) {
                    const userId = Business.userToken.validateToken({ token })
                    if (userId) {
                        req.currentUser = Business.user.database.find(
                            (x) => x.id == userId
                        )[0]

                        if (req.currentUser) {
                            next()
                            return
                        }
                    }
                }

                ErrorCollection.simple('error', 'TOKEN-001')
            }
        },
        true
    )
}
