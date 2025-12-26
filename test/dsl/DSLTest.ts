import { DSL } from './DSL'

export function DSLTest(name: string, fn: (dsl: () => DSL) => void) {
    let dsl: DSL
    describe(name, () => {
        beforeEach(async () => {
            dsl = await DSL.init()
        })

        afterEach(async () => {
            await dsl.close()
        })

        fn(() => dsl)
    })
}
