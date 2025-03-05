import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AccountAmountDto } from '../dto/account-amount.dto'
import { Account } from '../schema/account.schema'
import { Movement } from '../schema/movement.schema'
import { ErrorCollection } from '../utils/ErrorUtils'
import { AbstractService } from './abstract.service'

@Injectable()
export class AccountService extends AbstractService<Account> {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<Account>,
        @InjectModel(Movement.name) private movementModel: Model<Movement>
    ) {
        super(accountModel)
    }

    validateCreate(user: any) {
        const errors = new ErrorCollection()
        errors.add('name', 'VALIDATE-001', !user.name || user.name === '')
        errors.add('type', 'VALIDATE-001', !user.type || user.type === '')
        errors.throw()
    }

    validateUpdate(user: any) {
        const errors = new ErrorCollection()
        errors.add('name', 'VALIDATE-001', !user.name || user.name === '')
        errors.add('type', 'VALIDATE-001', !user.type || user.type === '')
        errors.throw()
    }

    async findAll(
        userId: string,
        search: string,
        month: string,
        year: string
    ): Promise<Partial<AccountAmountDto>[]> {
        const allAccounts = await this.accountModel
            .find({
                user: userId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { type: { $regex: search, $options: 'i' } },
                ],
            })
            .exec()

        const accounts: AccountAmountDto[] = []
        for (const account of allAccounts) {
            const movements = await this.movementModel
                .find({
                    $and: [
                        {
                            $or: [
                                {
                                    date: {
                                        $regex: new RegExp(
                                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                                        ),
                                    },
                                },
                                {
                                    dueDate: {
                                        $regex: new RegExp(
                                            `^\\d{2}/${month.padStart(2, '0')}/${year}$`
                                        ),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { destinyAccount: account._id },
                                { originAccount: account._id },
                            ],
                        },
                    ],
                    user: userId,
                })
                .exec()

            const newAccount: AccountAmountDto = JSON.parse(
                JSON.stringify(account)
            )
            newAccount.currentAmount = movements
                .filter((x) => x.dueDate)
                .map((movement) => {
                    if (movement.type === 'TRANSFER') {
                        if (movement.originAccount === account._id) {
                            return movement.value * -1
                        } else {
                            return movement.value
                        }
                    } else {
                        return movement.value
                    }
                })
                .reduce((x, y) => x + y, 0)
            newAccount.futureAmount = movements
                .map((movement) => {
                    if (movement.type === 'TRANSFER') {
                        if (movement.originAccount === account._id) {
                            return movement.value * -1
                        } else {
                            return movement.value
                        }
                    } else {
                        return movement.value
                    }
                })
                .reduce((x, y) => x + y, 0)
            accounts.push(newAccount)
        }
        return accounts
    }
}
