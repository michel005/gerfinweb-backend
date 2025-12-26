import { InjectRepository } from '@nestjs/typeorm'
import { BankAccount, Budget, Category, Movement, Recurrence, User } from '@/entity'
import { Repository } from 'typeorm'

export abstract class AbstractService {
    constructor(
        @InjectRepository(User) readonly userRepository: Repository<User>,
        @InjectRepository(Recurrence) readonly recurrenceRepository: Repository<Recurrence>,
        @InjectRepository(Movement) readonly movementRepository: Repository<Movement>,
        @InjectRepository(Category) readonly categoryRepository: Repository<Category>,
        @InjectRepository(Budget) readonly budgetRepository: Repository<Budget>,
        @InjectRepository(BankAccount) readonly bankAccountRepository: Repository<BankAccount>
    ) {}
}
