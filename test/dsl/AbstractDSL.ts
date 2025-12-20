import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import TestAgent from 'supertest/lib/agent'

export abstract class AbstractDSL {
    app: INestApplication
    supertest: TestAgent
    routine: [string, string, any][] = []
    routineEvents: { [key: string]: (param: any) => Promise<void> } = {}

    constructor(app: INestApplication, routineEvents: { [key: string]: (param: any) => Promise<void> } = {}) {
        this.app = app
        this.supertest = supertest(app.getHttpServer())
        this.routineEvents = routineEvents
    }

    routeStep(name: string, method: string, param: any) {
        this.routine.push([name, method, param])
    }

    async build() {
        console.log(
            `[${this.constructor.name}] Building DSL routine with ${this.routine.length} steps.\r\n[${this.constructor.name}] Test plan:\r\n${this.routine.map(([name, event], index) => `  ${index + 1}. ${name} (${event})`).join('\r\n')}`
        )
        for (const [, method, param] of this.routine) {
            if (this.routineEvents[method]) {
                await this.routineEvents[method](param)
            } else {
                throw new Error(`No routine event defined for method: ${method}`)
            }
        }
        return this
    }
}
