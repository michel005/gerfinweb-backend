import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Recurrence } from '@/entity/Recurrence'
import { Repository } from 'typeorm'
import { CreateRecurrenceDTO, ResponseRecurrenceDTO, ResponseRecurrenceListDTO, UpdateRecurrenceDTO } from './dto'
import { PaginationDTO } from '@/dto/PaginationDTO'
import { BankAccount } from '@/entity/BankAccount'

@Injectable()
export class RecurrenceService {
    constructor(
        @InjectRepository(Recurrence) readonly recurrenceRepository: Repository<Recurrence>,
        @InjectRepository(BankAccount) readonly bankAccountRepository: Repository<BankAccount>
    ) {}

    async create(userId: string, recurrence: CreateRecurrenceDTO): Promise<ResponseRecurrenceDTO> {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: {
                id: recurrence.originBankAccountId,
                user: {
                    id: userId,
                },
            },
        })

        if (!bankAccount) {
            throw new BadRequestException('Conta bancária de origem não encontrada')
        }
        const newRecurrence = Recurrence.fromDTO(recurrence)

        await newRecurrence.beforeInsert()
        const temp = this.recurrenceRepository.create({
            ...newRecurrence,
            originBankAccount: {
                id: recurrence.originBankAccountId,
            },
            user: {
                id: userId,
            },
        })
        await temp.beforeInsert()
        const response = await this.recurrenceRepository.save(temp)
        return response.toDTO()
    }

    async update(userId: string, id: string, recurrence: UpdateRecurrenceDTO): Promise<ResponseRecurrenceDTO> {
        const existingRecurrence = await this.recurrenceRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingRecurrence) {
            throw new BadRequestException('Recorrência não encontrada')
        }
        existingRecurrence.description = recurrence.description
        existingRecurrence.day = recurrence.day
        existingRecurrence.categories = recurrence.categories
        existingRecurrence.type = recurrence.type
        existingRecurrence.value = recurrence.value
        existingRecurrence.originBankAccount = new BankAccount()
        existingRecurrence.originBankAccount.id = recurrence.originBankAccountId
        const response = await this.recurrenceRepository.save(existingRecurrence)
        return response.toDTO()
    }

    async delete(userId: string, id: string): Promise<void> {
        const existingRecurrence = await this.recurrenceRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingRecurrence) {
            throw new BadRequestException('Recorrência não encontrada')
        }
        await this.recurrenceRepository.remove(existingRecurrence)
    }

    async getAll(userId: string, pagination: PaginationDTO): Promise<ResponseRecurrenceListDTO> {
        const recurrences = await this.recurrenceRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            skip: pagination.page * pagination.size,
            take: pagination.size,
            relations: {
                originBankAccount: true,
            },
        })
        const response = new ResponseRecurrenceListDTO()
        response.recurrences = recurrences.map((recurrence) => recurrence.toDTO())
        response.total = await this.recurrenceRepository.count({
            where: {
                user: {
                    id: userId,
                },
            },
        })
        return response
    }

    async detail(userId: string, id: string): Promise<ResponseRecurrenceDTO> {
        const recurrence = await this.recurrenceRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
            relations: {
                originBankAccount: true,
            },
        })
        if (!recurrence) {
            throw new BadRequestException('Recorrência não encontrada')
        }
        return recurrence.toDTO()
    }
}
