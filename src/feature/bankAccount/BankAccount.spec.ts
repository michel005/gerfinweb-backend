import { DSLTest } from '../../../test/dsl/DSLTest'
import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from '@/constant/ErrorCode'
import { BankAccountDSL } from '../../../test/dsl/BankAccountDSL'

DSLTest('BankAccountController > Create', (dsl) => {
    let token: string
    beforeEach(async () => {
        await dsl()
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .validateResponse((response) => {
                token = response.body.access_token
            })
            .build()
    })
    it('Create bank account successfully', async () => {
        await dsl()
            .bankAccount(token)
            .setBankAccountWithSimpleData()
            .create()
            .validateResponse((response) => {
                expect(response.body.id).toBeDefined()
            })
            .build()
    })
    it('Should validate the create form', async () => {
        await dsl()
            .bankAccount(token)
            .setBankAccountWithEmptyData()
            .create(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(Object.keys(response.body.details).length).toBe(3)
                expect(response.body.details.name).toBe(ErrorCode.GENERAL_INVALID_STRING_FIELD)
                expect(response.body.details.type).toBe(ErrorCode.GENERAL_INVALID_STRING_FIELD)
                expect(response.body.details.color).toBe(ErrorCode.GENERAL_INVALID_STRING_FIELD)
            })
            .build()
    })
    it('Should validate the create form with wrong type', async () => {
        await dsl()
            .bankAccount(token)
            .setBankAccountWithWrongTypeData()
            .create(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(Object.keys(response.body.details).length).toBe(1)
                expect(response.body.details.type).toBe(ErrorCode.GENERAL_INVALID_ENUM_FIELD)
            })
            .build()
    })
    it('Should validate the create form with wrong color', async () => {
        await dsl()
            .bankAccount(token)
            .setBankAccountWithWrongColorData()
            .create(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(Object.keys(response.body.details).length).toBe(1)
                expect(response.body.details.color).toBe(ErrorCode.GENERAL_INVALID_HEX_COLOR_FIELD)
            })
            .build()
    })
})

DSLTest('BankAccountController > Update', (dsl) => {
    let token: string
    let bankAccountDSL: BankAccountDSL
    beforeEach(async () => {
        await dsl()
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .validateResponse((response) => {
                token = response.body.access_token
            })
            .build()

        bankAccountDSL = dsl().bankAccount(token).setBankAccountWithSimpleData().create()
    })
    it('Update bank account successfully', async () => {
        await bankAccountDSL
            .setBankAccountDifferentName()
            .update(HttpStatus.OK)
            .validateResponse((response) => {
                expect(response.body.updatedAt).toBeDefined()
                expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
                    new Date(response.body.createdAt).getTime()
                )
                expect(response.body.name).toBe('Updated Bank Account Name')
            })
            .build()
    })
})

DSLTest('BankAccountController > Delete', (dsl) => {
    let token: string
    let bankAccountDSL: BankAccountDSL
    beforeEach(async () => {
        await dsl()
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .validateResponse((response) => {
                token = response.body.access_token
            })
            .build()

        bankAccountDSL = dsl().bankAccount(token).setBankAccountWithSimpleData().create()
    })
    it('Delete bank account successfully', async () => {
        await bankAccountDSL
            .delete(HttpStatus.OK)
            .detail(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Conta bancária não encontrada')
            })
            .build()
    })
})

DSLTest('BankAccountController > Detail', (dsl) => {
    let token: string
    let bankAccountDSL: BankAccountDSL
    beforeEach(async () => {
        await dsl()
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .validateResponse((response) => {
                token = response.body.access_token
            })
            .build()

        bankAccountDSL = dsl().bankAccount(token).setBankAccountWithSimpleData().create()
    })
    it('Get bank account detail successfully', async () => {
        await bankAccountDSL
            .detail(HttpStatus.OK)
            .validateResponse((response) => {
                expect(response.body.createdAt).not.toBe(response.body.updatedAt)
                expect(response.body.name).toBe('My Checking Account')
                expect(response.body.type).toBe('Salary')
                expect(response.body.color).toBe('#330000')
            })
            .build()
    })
})

DSLTest('BankAccountController > Amount', (dsl) => {
    let token: string
    let bankAccountDSL: BankAccountDSL
    beforeEach(async () => {
        await dsl()
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .validateResponse((response) => {
                token = response.body.access_token
            })
            .build()

        bankAccountDSL = dsl().bankAccount(token).setBankAccountWithSimpleData().create()
    })
    it('Get bank account amount successfully', async () => {
        await bankAccountDSL
            .setBanAccountAmountData()
            .amount(HttpStatus.OK)
            .validateResponse((response) => {
                expect(response.body.date).toBe(new Date().toISOString().split('T')[0])
                expect(response.body.bankAccount).toBeDefined()
                expect(response.body.future).toBe(0)
                expect(response.body.current).toBe(0)
            })
            .build()
    })
})

DSLTest('BankAccountController > Get all', (dsl) => {
    let token: string
    let bankAccountDSL: BankAccountDSL
    beforeEach(async () => {
        await dsl()
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .validateResponse((response) => {
                token = response.body.access_token
            })
            .build()

        bankAccountDSL = dsl()
            .bankAccount(token)
            .setBankAccountWithSimpleData()
            .create()
            .setAccountSampleData1()
            .create()
            .setAccountSampleData2()
            .create()
    })
    it('Get all accounts successfully', async () => {
        await bankAccountDSL
            .findAll()
            .validateResponse((response) => {
                expect(response.body.total).toBe(3)
                expect(response.body.accounts.length).toBe(3)
            })
            .build()
    })
    it('Get accounts filtering by type', async () => {
        await bankAccountDSL
            .setFilterByDebitType()
            .findAll()
            .validateResponse((response) => {
                expect(response.body.total).toBe(1)
                expect(response.body.accounts.length).toBe(1)
                expect(response.body.accounts[0].type).toBe('Debit')
            })
            .build()
    })
    it('Get accounts filtering by name', async () => {
        await bankAccountDSL
            .setFilterByName()
            .findAll()
            .validateResponse((response) => {
                expect(response.body.total).toBe(1)
                expect(response.body.accounts.length).toBe(1)
                expect(response.body.accounts[0].name).toBe('Savings Account')
            })
            .build()
    })
})
