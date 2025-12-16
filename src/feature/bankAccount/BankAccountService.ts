import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BankAccount } from 'src/entity/BankAccount'
import { Repository } from 'typeorm'
import { CreateBankAccountDTO, GetAllBankAccountDTO, ResponseBankAccountDTO, ResponseBankAccountListDTO } from './dto'

@Injectable()
export class BankAccountService {
    constructor(@InjectRepository(BankAccount) readonly bankAccountRepository: Repository<BankAccount>) {}

    async create(userId: string, bankAccount: CreateBankAccountDTO): Promise<ResponseBankAccountDTO> {
        const newBankAccount = BankAccount.fromDTO(bankAccount)
        await newBankAccount.beforeInsert()
        const temp = this.bankAccountRepository.create({
            ...newBankAccount,
            user: {
                id: userId,
            },
        })
        await temp.beforeInsert()
        const response = await this.bankAccountRepository.save(temp)
        return response.toDTO()
    }

    async getAll(userId: string, bankAccount: GetAllBankAccountDTO): Promise<ResponseBankAccountListDTO> {
        const where: any = {
            user: {
                id: userId,
            },
        }
        if (bankAccount.name) {
            where.name = bankAccount.name
        }
        if (bankAccount.type) {
            where.type = bankAccount.type
        }
        const response = await this.bankAccountRepository.find({
            where: where,
            skip: bankAccount.page * bankAccount.size,
            take: bankAccount.size,
        })
        return {
            accounts: response.map((bankAccount) => bankAccount.toDTO()),
        }
    }
}
