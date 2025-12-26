import { AbstractDSL } from './AbstractDSL'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { DSL } from './DSL'

export class BankAccountDSL extends AbstractDSL {
    bankAccountData: any
    filterData: any
    amountData: any
    id: string
    response: any

    constructor(app: INestApplication, root: DSL, token: string) {
        super(app, root, {
            setBankAccountData: async (param: any) => {
                this.bankAccountData = param
            },
            filter: async (param: any) => {
                this.filterData = param
            },
            editBankAccountData: async (paramFn: (data: any) => any) => {
                this.bankAccountData = paramFn(this.bankAccountData)
            },
            amountData: async (param: any) => {
                this.amountData = param
            },
            create: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .post('/bankAccount/create')
                        .set('Authorization', `Bearer ${token}`)
                        .send(this.bankAccountData)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .post('/bankAccount/create')
                        .set('Authorization', `Bearer ${token}`)
                        .send(this.bankAccountData)
                }
                if (this.response.body && this.response.body.id) {
                    this.id = this.response.body.id
                }
            },
            update: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .put(`/bankAccount/${this.id}/update`)
                        .set('Authorization', `Bearer ${token}`)
                        .send(this.bankAccountData)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .put(`/bankAccount/${this.id}/update`)
                        .set('Authorization', `Bearer ${token}`)
                        .send(this.bankAccountData)
                }
            },
            delete: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .delete(`/bankAccount/${this.id}/delete`)
                        .set('Authorization', `Bearer ${token}`)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .delete(`/bankAccount/${this.id}/delete`)
                        .set('Authorization', `Bearer ${token}`)
                }
            },
            detail: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .get(`/bankAccount/${this.id}/detail`)
                        .set('Authorization', `Bearer ${token}`)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .get(`/bankAccount/${this.id}/detail`)
                        .set('Authorization', `Bearer ${token}`)
                }
            },
            amount: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .get(`/bankAccount/${this.id}/amount/${this.amountData.date}`)
                        .set('Authorization', `Bearer ${token}`)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .get(`/bankAccount/${this.id}/amount/${this.amountData.date}`)
                        .set('Authorization', `Bearer ${token}`)
                }
            },
            getAll: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .get(
                            `/bankAccount/getAll?page=0&size=10&type=${this.filterData?.type || ''}&name=${this.filterData?.name || ''}`
                        )
                        .set('Authorization', `Bearer ${token}`)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .get(
                            `/bankAccount/getAll?page=0&size=10&type=${this.filterData?.type || ''}&name=${this.filterData?.name || ''}`
                        )
                        .set('Authorization', `Bearer ${token}`)
                }
            },
            validateResponse: async (validator: (response: any) => void) => {
                validator(this.response)
            },
        })
    }

    setAccountSampleData1() {
        this.routeStep('Set bank account sample data 1', 'setBankAccountData', {
            name: 'Primary Account',
            type: 'Debit',
            color: '#123456',
        })
        return this
    }

    setAccountSampleData2() {
        this.routeStep('Set bank account sample data 2', 'setBankAccountData', {
            name: 'Savings Account',
            type: 'Savings',
            color: '#654321',
        })
        return this
    }

    setBankAccountWithSimpleData() {
        this.routeStep('Set bank account with simple data', 'setBankAccountData', {
            name: 'My Checking Account',
            type: 'Salary',
            color: '#330000',
        })
        return this
    }

    setBankAccountWithWrongTypeData() {
        this.routeStep('Set bank account with simple data', 'setBankAccountData', {
            name: 'My Checking Account',
            type: 'xxx',
            color: '#330000',
        })
        return this
    }

    setBankAccountWithWrongColorData() {
        this.routeStep('Set bank account with simple data', 'setBankAccountData', {
            name: 'My Checking Account',
            type: 'Salary',
            color: '#xxxxx',
        })
        return this
    }

    setBankAccountWithEmptyData() {
        this.routeStep('Set bank account with empty data', 'setBankAccountData', {})
        return this
    }

    setBankAccountDifferentName() {
        this.routeStep('Set Different Bank Account Name', 'editBankAccountData', (x) => {
            x.name = 'Updated Bank Account Name'
            return x
        })
        return this
    }

    setBanAccountAmountData() {
        this.routeStep('Set bank account amount data', 'amountData', {
            date: new Date().toISOString().split('T')[0],
        })
        return this
    }

    setFilterByDebitType() {
        this.routeStep('Set filter by Debit type', 'filter', {
            type: 'Debit',
        })
        return this
    }

    setFilterByName() {
        this.routeStep('Set filter by Debit type', 'filter', {
            name: 'Savings Account',
        })
        return this
    }

    create(expectedStatus?: HttpStatus) {
        this.routeStep('Create bank account', 'create', expectedStatus)
        return this
    }

    update(expectedStatus?: HttpStatus) {
        this.routeStep('Update bank account', 'update', expectedStatus)
        return this
    }

    delete(expectedStatus?: HttpStatus) {
        this.routeStep('Delete bank account', 'delete', expectedStatus)
        return this
    }

    detail(expectedStatus?: HttpStatus) {
        this.routeStep('Get bank account detail', 'detail', expectedStatus)
        return this
    }

    amount(expectedStatus?: HttpStatus) {
        this.routeStep('Get bank account amount', 'amount', expectedStatus)
        return this
    }

    findAll(expectedStatus?: HttpStatus) {
        this.routeStep('Get all bank accounts', 'getAll', expectedStatus)
        return this
    }

    validateResponse(validator: (response: any) => void) {
        this.routeStep('Validate response', 'validateResponse', validator)
        return this
    }
}
