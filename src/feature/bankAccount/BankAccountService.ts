import { BadRequestException, Injectable } from '@nestjs/common'
import { BankAccount } from '@/entity/BankAccount'
import { CreateBankAccountDTO, GetAllBankAccountDTO, ResponseBankAccountDTO, ResponseBankAccountListDTO } from './dto'
import { UpdateBankAccountDTO } from './dto/UpdateBankAccountDTO'
import { AmountBankAccountDTO } from '@/feature/bankAccount/dto/AmountBankAccountDTO'
import { AbstractService } from '@/feature/AbstractService'
import { AccountTypeDomain } from '@/type/AccountTypeDomain'
import { parseISO } from 'date-fns'
import { User } from '@/entity'

@Injectable()
export class BankAccountService extends AbstractService {
    async create(userId: string, bankAccount: CreateBankAccountDTO): Promise<ResponseBankAccountDTO> {
        const newBankAccount = BankAccount.fromDTO(bankAccount)
        await newBankAccount.beforeInsert()
        const temp = this.bankAccountRepository.create({
            ...newBankAccount,
            user: {
                id: userId,
            },
        })
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

    async adjustCurrentAmount(userId: string, id: string, amount: number) {
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
        const newMovement = this.movementRepository.create()
        newMovement.date = parseISO(new Date().toISOString().split('T')[0])
        newMovement.description = 'Ajuste de saldo'
        newMovement.value = amount
        newMovement.approved = true
        newMovement.user = new User()
        newMovement.user.id = userId

        newMovement.originBankAccount = existingBankAccount
        await this.movementRepository.save(newMovement)
    }

    async delete(userId: string, id: string) {
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
        existingBankAccount.active = false
        const response = await this.bankAccountRepository.save(existingBankAccount)
        return response.toDTO()
    }

    async getAll(userId: string, bankAccount: GetAllBankAccountDTO): Promise<ResponseBankAccountListDTO> {
        const where: any = {
            user: {
                id: userId,
            },
            active: true,
        }
        if (bankAccount.name) {
            where.name = bankAccount.name
        }
        if (bankAccount.type) {
            where.type = bankAccount.type
        }
        const response = await this.bankAccountRepository.find({
            where: where,
        })
        return {
            accounts: response.map((bankAccount) => bankAccount.toDTO()),
            total: await this.bankAccountRepository.count({ where: where }),
        }
    }

    async getAllWithAmount(
        userId: string,
        bankAccount: GetAllBankAccountDTO,
        date: Date
    ): Promise<{
        accounts: (ResponseBankAccountDTO & Omit<AmountBankAccountDTO, 'bankAccount'>)[]
        total: number
        filters: any
    }> {
        const where: any = {
            user: {
                id: userId,
            },
            active: true,
        }
        if (bankAccount.name) {
            where.name = bankAccount.name
        }
        if (bankAccount.type) {
            where.type = bankAccount.type
        }

        const queryBuilder = this.bankAccountRepository
            .createQueryBuilder('ba')
            .leftJoin(
                'Movement',
                'm',
                '(m.originBankAccountId = ba.id OR m.destinationBankAccount = ba.id) AND m.userId = :userId AND m.date <= :date',
                { userId, date }
            )
            .select('ba')
            .addSelect(
                'COALESCE(SUM(CASE WHEN m.date is not null AND m.date <= :now THEN CASE WHEN m.destinationBankAccount IS NOT NULL AND m.originBankAccountId = ba.id THEN (m.value * -1) ELSE m.value END ELSE 0 END), 0)',
                'current'
            )
            .addSelect(
                'COALESCE(SUM(CASE WHEN m.destinationBankAccount IS NOT NULL AND m.originBankAccountId = ba.id THEN (m.value * -1) ELSE m.value END), 0)',
                'future'
            )
            .where('ba.userId = :userId', { userId })
            .andWhere('ba.active = :active', { active: true })
            .setParameter('now', new Date().toISOString().split('T')[0])
            .setParameter('date', date)
            .groupBy('ba.id')

        if (bankAccount.name) {
            queryBuilder.andWhere('ba.name = :name', { name: bankAccount.name })
        }
        if (bankAccount.type) {
            queryBuilder.andWhere('ba.type = :type', { type: bankAccount.type })
        }

        const accounts = await queryBuilder.getRawAndEntities()

        return {
            accounts: accounts.entities.map((account: any, index) => ({
                ...account.toDTO(),
                current: parseFloat(accounts.raw[index].current || 0),
                future: parseFloat(accounts.raw[index].future || 0),
            })),
            filters: { bankAccount, where },
            total: await this.bankAccountRepository.count({ where }),
        }
    }

    async detail(userId: string, id: string): Promise<ResponseBankAccountDTO> {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
                active: true,
            },
        })
        if (!bankAccount) {
            throw new BadRequestException('Conta bancária não encontrada')
        }
        return bankAccount.toDTO()
    }

    async search(userId: string, search: string) {
        const searchMap = Object.entries(AccountTypeDomain).reduce(
            (acc, [key, value]) => {
                acc[value.toLowerCase()] = key
                return acc
            },
            {} as Record<string, string>
        )
        const searchLower = search.toLowerCase()
        const typeMatch = searchMap[searchLower] || search

        const response = await this.bankAccountRepository
            .createQueryBuilder('bankAccount')
            .where('(bankAccount.name LIKE :search OR bankAccount.type LIKE :typeMatch)', {
                search: `%${search}%`,
                typeMatch: `%${typeMatch}%`,
            })
            .andWhere('bankAccount.userId = :userId', { userId })
            .andWhere('active = :active', { active: true })
            .getMany()
        return response.map((x) => x.toDTO())
    }
}
