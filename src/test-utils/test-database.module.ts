import { TypeOrmModule } from '@nestjs/typeorm'
import { BankAccount } from '../entity/BankAccount'
import { Recurrence } from '../entity/Recurrence'
import { User } from '../entity/User'

export const TestDatabaseModule = TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [User, BankAccount, Recurrence],
    synchronize: true,
    logging: false,
})
