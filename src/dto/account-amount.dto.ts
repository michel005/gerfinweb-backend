import { Account } from '../schema/account.schema'

export class AccountAmountDto extends Account {
    currentAmount?: number
    futureAmount?: number
}
