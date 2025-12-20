import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BankAccount } from '@/entity/BankAccount'
import { Repository } from 'typeorm'
import { CreateBankAccountDTO, GetAllBankAccountDTO, ResponseBankAccountDTO, ResponseBankAccountListDTO } from './dto'
import { UpdateBankAccountDTO } from './dto/UpdateBankAccountDTO'

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

    async update(userId: string, id: string, bankAccount: UpdateBankAccountDTO): Promise<ResponseBankAccountDTO> {
        const existingBankAccount = await this.bankAccountRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingBankAccount) {
            throw new BadRequestException('Conta bancária não encontrada')
        }
        existingBankAccount.name = bankAccount.name
        existingBankAccount.type = bankAccount.type
        if (bankAccount.color !== undefined) {
            existingBankAccount.color = bankAccount.color
        }
        const response = await this.bankAccountRepository.save(existingBankAccount)
        return response.toDTO()
    }

    async delete(userId: string, id: string): Promise<void> {
        const existingBankAccount = await this.bankAccountRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingBankAccount) {
            throw new BadRequestException('Conta bancária não encontrada')
        }
        await this.bankAccountRepository.remove(existingBankAccount)
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
            total: await this.bankAccountRepository.count({ where: where }),
        }
    }

    async detail(userId: string, id: string): Promise<ResponseBankAccountDTO> {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!bankAccount) {
            throw new BadRequestException('Conta bancária não encontrada')
        }
        return bankAccount.toDTO()
    }
}
