import { BadRequestException, Injectable } from '@nestjs/common'
import { Recurrence } from '@/entity/Recurrence'
import { CreateRecurrenceDTO, ResponseRecurrenceDTO, ResponseRecurrenceListDTO, UpdateRecurrenceDTO } from './dto'
import { BankAccount } from '@/entity/BankAccount'
import { ResponseMovementDTO } from '@/feature/movement/dto'
import { Category } from '@/entity/Category'
import { AbstractService } from '@/feature/AbstractService'
import { Movement } from '@/entity'
import { CreateBatchRecurrenceDTO } from './dto/CreateBatchRecurrenceDTO'

function getMonthRange(month: number, year: number) {
    const offsets = [-1, 0, 1, 2]

    return offsets.map((offset) => {
        const date = new Date(year, month - 1 + offset)

        return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        }
    })
}

@Injectable()
export class RecurrenceService extends AbstractService {
    async create(userId: string, recurrence: CreateRecurrenceDTO): Promise<ResponseRecurrenceDTO> {
        if (recurrence.originBankAccountId) {
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

    async createBatch(userId: string, recurrence: CreateBatchRecurrenceDTO): Promise<void> {
        for (const rec of recurrence.recurrences) {
            const newRecurrence = Recurrence.fromDTO({
                ...rec,
                day: recurrence.day,
                type: recurrence.type,
                originBankAccountId: recurrence.originBankAccountId,
            })

            await newRecurrence.beforeInsert()
            const temp = this.recurrenceRepository.create({
                ...newRecurrence,
                user: {
                    id: userId,
                },
            })
            await temp.beforeInsert()
            await this.recurrenceRepository.save(temp)
        }
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
        if (recurrence.categoryId) {
            existingRecurrence.category = new Category()
            existingRecurrence.category.id = recurrence.categoryId
        } else {
            existingRecurrence.category = null
        }
        existingRecurrence.type = recurrence.type
        existingRecurrence.value = recurrence.value
        if (recurrence.originBankAccountId) {
            existingRecurrence.originBankAccount = new BankAccount()
            existingRecurrence.originBankAccount.id = recurrence.originBankAccountId
        } else {
            existingRecurrence.originBankAccount = null
        }
        if (recurrence.destinationBankAccountId) {
            existingRecurrence.destinationBankAccount = new BankAccount()
            existingRecurrence.destinationBankAccount.id = recurrence.destinationBankAccountId
        } else {
            existingRecurrence.destinationBankAccount = null
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

    async getAll(userId: string): Promise<ResponseRecurrenceListDTO> {
        const recurrences = await this.recurrenceRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: {
                originBankAccount: true,
                destinationBankAccount: true,
                category: true,
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

    async getAllByMonthYear(userId: string, month: number, year: number) {
        const periods = getMonthRange(month, year)

        const query = this.recurrenceRepository
            .createQueryBuilder('recurrence')
            .leftJoinAndSelect('recurrence.category', 'category')
            .leftJoinAndSelect('recurrence.originBankAccount', 'originBankAccount')
            .leftJoinAndSelect('recurrence.destinationBankAccount', 'destinationBankAccount')

        const conditions: string[] = []
        const parameters: any = {}

        periods.forEach((p, index) => {
            const mKey = `month${index}`
            const yKey = `year${index}`
            conditions.push(`(MONTH(movement.date) = :${mKey} AND YEAR(movement.date) = :${yKey})`)
            parameters[mKey] = p.month
            parameters[yKey] = p.year
        })

        const conditionString = conditions.length > 0 ? conditions.join(' OR ') : '1=0'

        query
            .leftJoin(
                Movement,
                'movement',
                `movement.recurrenceId = recurrence.id AND (${conditionString})`,
                parameters
            )
            .where('recurrence.userId = :userId', { userId })
            .addSelect('MONTH(movement.date)', 'movementMonth')
            .addSelect('YEAR(movement.date)', 'movementYear')
            .addSelect('SUM(COALESCE(movement.value, 0))', 'totalAmount')
            .addSelect('COUNT(movement.id)', 'count')
            .addSelect('SUM(case when movement.approved = false then 1 else 0 end)', 'countPendent')
            .groupBy('recurrence.id')
            .addGroupBy('movementMonth')
            .addGroupBy('movementYear')

        const rawResults = await query.getRawAndEntities()

        return rawResults.entities.map((recurrence) => {
            const totalsForThisRecurrence = rawResults.raw
                .filter((r) => r.recurrence_id === recurrence.id && r.movementMonth !== null)
                .map((r) => ({
                    month: parseInt(r.movementMonth),
                    year: parseInt(r.movementYear),
                    totalAmount: parseFloat(r.totalAmount || '0'),
                    count: Number(r.count || '0'),
                    countPendent: Number(r.countPendent || '0'),
                }))

            const monthlyBalances = periods.map((p) => {
                const found = totalsForThisRecurrence.find((t) => t.month === p.month && t.year === p.year)
                return {
                    month: p.month,
                    year: p.year,
                    totalAmount: found ? found.totalAmount : 0,
                    count: found ? Number(found.count || '0') : 0,
                    countPendent: found ? Number(found.countPendent || '0') : 0,
                }
            })

            return {
                ...recurrence.toDTO(),
                monthlyBalances,
            }
        })
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
                destinationBankAccount: true,
                category: true,
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
                destinationBankAccount: true,
                category: true,
            },
        })
        if (!recurrence) {
            throw new BadRequestException('Recorrência não encontrada')
        }
        return {
            date: new Date(year, month - 1, recurrence.day).toISOString().split('T')[0],
            description: recurrence.description,
            value: recurrence.value,
            category: recurrence.category ? recurrence.category.toDTO() : undefined,
            originBankAccount: recurrence.originBankAccount ? recurrence.originBankAccount.toDTO() : undefined,
            destinationBankAccount: recurrence.destinationBankAccount
                ? recurrence.destinationBankAccount.toDTO()
                : undefined,
            recurrence: recurrence.toDTO(),
            approved: false,
        }
    }
}
