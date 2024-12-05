import { Router } from 'express'
import p from 'path'

export const DefaultRoute = ({
    router,
    mainPath,
    paths,
}: {
    router: Router
    mainPath: string
    paths: [string, 'GET' | 'POST' | 'PUT' | 'DELETE', any][]
}) => {
    for (const [path, method, request] of paths) {
        const finalPath = p.join(mainPath, path)
        console.log(`${method}: ${finalPath}`)
        if (method === 'GET') {
            router.get(finalPath, request)
        }
        if (method === 'POST') {
            router.post(finalPath, request)
        }
        if (method === 'PUT') {
            router.put(finalPath, request)
        }
        if (method === 'DELETE') {
            router.delete(finalPath, request)
        }
    }
    return router
}
