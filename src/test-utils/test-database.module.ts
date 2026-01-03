import { TypeOrmModule } from '@nestjs/typeorm'
import { BankAccount } from '@/entity'
import { Recurrence } from '@/entity'
import { User } from '@/entity'

export const TestDatabaseModule = TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [User, BankAccount, Recurrence],
    synchronize: true,
    logging: false,
})
