import { BadRequestException, Injectable } from '@nestjs/common'
import { Recurrence } from '@/entity/Recurrence'
import { CreateRecurrenceDTO, ResponseRecurrenceDTO, ResponseRecurrenceListDTO, UpdateRecurrenceDTO } from './dto'
import { PaginationDTO } from '@/dto/PaginationDTO'
import { BankAccount } from '@/entity/BankAccount'
import { ResponseMovementDTO } from '@/feature/movement/dto'
import { Category } from '@/entity/Category'
import { AbstractService } from '@/feature/AbstractService'

@Injectable()
export class RecurrenceService extends AbstractService {
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
        existingRecurrence.category = new Category()
        existingRecurrence.category.id = recurrence.categoryId
        existingRecurrence.type = recurrence.type
        existingRecurrence.value = recurrence.value
        existingRecurrence.originBankAccount = new BankAccount()
        existingRecurrence.originBankAccount.id = recurrence.originBankAccountId
        if (recurrence.destinationBankAccountId) {
            existingRecurrence.destinationBankAccount = new BankAccount()
            existingRecurrence.destinationBankAccount.id = recurrence.destinationBankAccountId
        }

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

    async toMovement(userId: string, id: string, year: number, month: number): Promise<ResponseMovementDTO> {
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
        return {
            dueDate: new Date(year, month - 1, recurrence.day),
            description: recurrence.description,
            value: recurrence.value,
            category: recurrence.category.toDTO(),
            originBankAccount: recurrence.originBankAccount,
            recurrence: recurrence.toDTO(),
        }
    }
}
