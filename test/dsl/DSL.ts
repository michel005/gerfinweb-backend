import { UserDSL } from './UserDSL'
import { createTestApp } from '../utils/createTestApp'
import { INestApplication } from '@nestjs/common'
import { BankAccountDSL } from './BankAccountDSL'

export class DSL {
    app: INestApplication

    constructor(app: INestApplication) {
        this.app = app
    }

    user() {
        return new UserDSL(this.app, this)
    }

    bankAccount(token: string) {
        return new BankAccountDSL(this.app, this, token)
    }

    static async init() {
        const app = await createTestApp()
        return new DSL(app)
    }

    async close() {
        await this.app.close()
    }
}
