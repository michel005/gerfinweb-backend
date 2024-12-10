import { Response } from 'express'

export const DefaultRouterResolver = async (
    res: Response,
    callback: () => any | Promise<any>,
    dontUseReturn: boolean = false
) => {
    try {
        const result =
            typeof callback === 'function' ? await callback() : callback

        if (!dontUseReturn) {
            res.status(200).send(result)
        }
    } catch (error) {
        console.error(error)
        res.status(422).send({
            error: error instanceof Error ? error.message : error,
        })
    }
}
