import { UserDSL } from './UserDSL'
import { createTestApp } from '../utils/createTestApp'
import { INestApplication } from '@nestjs/common'

export class DSL {
    app: INestApplication

    constructor(app: INestApplication) {
        this.app = app
    }

    user() {
        return new UserDSL(this.app)
    }

    static async init() {
        const app = await createTestApp()
        return new DSL(app)
    }

    async close() {
        await this.app.close()
    }
}
