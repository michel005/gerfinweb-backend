import { BadRequestException, Injectable } from '@nestjs/common'
import { Movement } from '@/entity/Movement'
import { CreateMovementDTO, ResponseMovementDTO, UpdateMovementDTO } from '@/feature/movement/dto'
import { BankAccount } from '@/entity/BankAccount'
import { ResponseRecurrenceDTO } from '@/feature/recurrences/dto'
import { Category } from '@/entity/Category'
import { AbstractService } from '@/feature/AbstractService'
import { Recurrence } from '@/entity'
import { AmountByDayOfMonthYear } from '@/feature/movement/dto/AmountByDayOfMonthYear'
import { parseISO } from 'date-fns'

@Injectable()
class MovementService extends AbstractService {
    async create(userId: string, data: CreateMovementDTO) {
        const movementData = Movement.fromDTO(data)
        await movementData.beforeInsert()
        const movement = this.movementRepository.create({
            ...movementData,
            user: {
                id: userId,
            },
        })
        const response = await this.movementRepository.save(movement)
        return response.toDTO()
    }

    async update(userId: string, id: string, movement: UpdateMovementDTO) {
        const existingMovement = await this.movementRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingMovement) {
            throw new BadRequestException('Movimentação não encontrada')
        }
        existingMovement.description = movement.description
        existingMovement.date = movement.date
        existingMovement.value = movement.value
        existingMovement.originBankAccount = new BankAccount()
        existingMovement.originBankAccount.id = movement.originBankAccountId
        existingMovement.approved = movement.approved
        if (movement.categoryId) {
            existingMovement.category = new Category()
            existingMovement.category.id = movement.categoryId
        } else {
            existingMovement.category = null
        }
        if (movement.recurrenceId) {
            existingMovement.recurrence = new Recurrence()
            existingMovement.recurrence.id = movement.recurrenceId
        } else {
            existingMovement.recurrence = null
        }
        if (movement.destinationBankAccountId) {
            existingMovement.destinationBankAccount = new BankAccount()
            existingMovement.destinationBankAccount.id = movement.destinationBankAccountId
        } else {
            existingMovement.destinationBankAccount = null
        }
        const response = await this.movementRepository.save(existingMovement)
        return response.toDTO()
    }

    async approve(userId: string, id: string) {
        const existingMovement = await this.movementRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingMovement) {
            throw new BadRequestException('Movimentação não encontrada')
        }
        existingMovement.approved = true
        existingMovement.date = parseISO(new Date().toISOString().split('T')[0])
        const response = await this.movementRepository.save(existingMovement)
        return response.toDTO()
    }

    async disapprove(userId: string, id: string) {
        const existingMovement = await this.movementRepository.findOne({
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
                recurrence: true,
            },
        })
        if (!existingMovement) {
            throw new BadRequestException('Movimentação não encontrada')
        }
        if (existingMovement.recurrence?.day) {
            const templateDay = existingMovement.recurrence?.day
            console.log(existingMovement.date)
            existingMovement.date = parseISO(
                `${existingMovement.date.getFullYear()}-${(existingMovement.date.getMonth() + 1).toString().padStart(2, '0')}-${templateDay.toString().padStart(2, '0')}`
            )
        }
        existingMovement.approved = false
        const response = await this.movementRepository.save(existingMovement)
        return response.toDTO()
    }

    async delete(userId: string, id: string): Promise<void> {
        const existingRecurrence = await this.movementRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingRecurrence) {
            throw new BadRequestException('Movimentação não encontrada')
        }
        await this.movementRepository.remove(existingRecurrence)
    }

    async detail(userId: string, id: string) {
        const movement = await this.movementRepository.findOne({
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
                recurrence: true,
            },
        })
        if (!movement) {
            throw new BadRequestException('Movimentação não encontrada')
        }
        return movement.toDTO()
    }

    async getByMonthYear(userId: string, month: number, year: number) {
        const movements = await this.movementRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.category', 'category')
            .leftJoinAndSelect('movement.recurrence', 'recurrence')
            .leftJoinAndSelect('movement.originBankAccount', 'originBankAccount')
            .leftJoinAndSelect('movement.destinationBankAccount', 'destinationBankAccount')
            .where('movement.userId = :userId', { userId })
            .andWhere('EXTRACT(MONTH FROM movement.date) = :month', { month })
            .andWhere('EXTRACT(YEAR FROM movement.date) = :year', { year })
            .getMany()

        return {
            movements: movements.map((movement) => movement.toDTO()),
            total: movements.length,
        }
    }

    async getByRecurrencesByMonthYear(userId: string, month: number, year: number) {
        const movements = await this.movementRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.category', 'category')
            .leftJoinAndSelect('movement.recurrence', 'recurrence')
            .leftJoinAndSelect('movement.originBankAccount', 'originBankAccount')
            .leftJoinAndSelect('movement.destinationBankAccount', 'destinationBankAccount')
            .where('movement.userId = :userId', { userId })
            .andWhere('EXTRACT(MONTH FROM movement.date) = :month', { month })
            .andWhere('EXTRACT(YEAR FROM movement.date) = :year', { year })
            .getMany()

        const recurrences = await this.recurrenceRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
        })

        const otherMovements = movements.filter((m) => !m.recurrence)
        const groupedByRecurrence: { [key: string]: ResponseMovementDTO[] } = {}

        movements
            .filter((x) => x.recurrence)
            .forEach((movement) => {
                const recurrenceId = movement.recurrence?.id
                if (recurrenceId) {
                    if (!groupedByRecurrence[recurrenceId]) {
                        groupedByRecurrence[recurrenceId] = []
                    }
                    groupedByRecurrence[recurrenceId].push(movement.toDTO())
                }
            })

        const result: {
            recurrence: ResponseRecurrenceDTO
            movements: ResponseMovementDTO[]
            debits: number
            credits: number
            totalAmount: number
        }[] = []

        recurrences.forEach((e) => {
            result.push({
                recurrence: e.toDTO(),
                movements: groupedByRecurrence?.[e.id] || [],
                debits: groupedByRecurrence?.[e.id]
                    ? groupedByRecurrence[e.id].filter((m) => m.value < 0).reduce((acc, curr) => acc + curr.value, 0)
                    : 0,
                credits: groupedByRecurrence?.[e.id]
                    ? groupedByRecurrence[e.id].filter((m) => m.value > 0).reduce((acc, curr) => acc + curr.value, 0)
                    : 0,
                totalAmount: groupedByRecurrence?.[e.id]
                    ? groupedByRecurrence[e.id].reduce((acc, curr) => acc + curr.value, 0)
                    : 0,
            })
        })

        return {
            month,
            year,
            recurrences: result,
            otherMovements: {
                movements: otherMovements.map((m) => m.toDTO()),
                debits: otherMovements.filter((m) => m.value < 0).reduce((acc, curr) => acc + curr.value, 0),
                credits: otherMovements.filter((m) => m.value > 0).reduce((acc, curr) => acc + curr.value, 0),
                totalAmount: otherMovements.reduce((acc, curr) => acc + curr.value, 0),
            },
        }
    }

    async lastMovements(userId: string, limit: number = 5) {
        const movements = await this.movementRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.originBankAccount', 'originBankAccount')
            .leftJoinAndSelect('movement.destinationBankAccount', 'destinationBankAccount')
            .leftJoinAndSelect('movement.category', 'category')
            .where('movement.userId = :userId', { userId })
            .orderBy('movement.createdAt', 'DESC')
            .limit(limit)
            .orderBy('movement.createdAt', 'ASC')
            .getMany()

        return movements.map((movement) => movement.toDTO())
    }

    async pendentMovements(userId: string, month: number, year: number) {
        const movements = await this.movementRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.originBankAccount', 'originBankAccount')
            .leftJoinAndSelect('movement.destinationBankAccount', 'destinationBankAccount')
            .leftJoinAndSelect('movement.category', 'category')
            .where(
                'movement.userId = :userId AND MONTH(movement.date) = :month AND YEAR(movement.date) = :year AND movement.approved = false',
                { userId, month, year }
            )
            .orderBy('movement.value', 'ASC')
            .getMany()

        return movements.map((movement) => movement.toDTO())
    }

    async search(userId: string, search: string) {
        const response = await this.movementRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.originBankAccount', 'originBankAccount')
            .leftJoinAndSelect('movement.destinationBankAccount', 'destinationBankAccount')
            .leftJoinAndSelect('movement.category', 'category')
            .where('movement.description LIKE :search AND movement.userId = :userId', { search: `%${search}%`, userId })
            .getMany()
        return response.map((x) => x.toDTO())
    }

    async amountByDayOfMonthYear(userId: string, month: number, year: number): Promise<AmountByDayOfMonthYear> {
        const response = await this.movementRepository
            .createQueryBuilder('movement')
            .where('movement.userId = :userId', { userId })
            .andWhere('EXTRACT(MONTH FROM movement.date) = :month', { month })
            .andWhere('EXTRACT(YEAR FROM movement.date) = :year', { year })
            .select('EXTRACT(DAY FROM movement.date)', 'day')
            .addSelect('SUM(CASE WHEN movement.approved THEN movement.value ELSE 0 END)', 'current')
            .addSelect('SUM(movement.value)', 'future')
            .groupBy('day')
            .orderBy('day', 'ASC')
            .getRawMany()
        const allDaysInMonth = new Date(year, month, 0).getDate()
        for (let day = 1; day <= allDaysInMonth; day++) {
            if (!response.find((r) => Number(r.day) === day)) {
                response.push({ day: day, current: 0, future: 0 })
            } else {
                const dayRecord = response.find((r) => Number(r.day) === day)
                if (dayRecord) {
                    dayRecord.current = Number(dayRecord.current)
                    dayRecord.future = Number(dayRecord.future)
                }
            }
        }
        const finalResponse = response.sort((a, b) => Number(a.day) - Number(b.day))
        let currentSum = 0
        let futureSum = 0
        let max = Number.NEGATIVE_INFINITY
        let min = Number.POSITIVE_INFINITY
        for (const record of finalResponse) {
            currentSum += Number(record.current)
            futureSum += Number(record.future)
            if (currentSum > max) {
                max = currentSum
            }
            if (futureSum > max) {
                max = futureSum
            }
            if (currentSum < min) {
                min = currentSum
            }
            if (futureSum < min) {
                min = futureSum
            }
            record.current = currentSum
            record.future = futureSum
        }

        return {
            month,
            year,
            max: max === Number.NEGATIVE_INFINITY ? 0 : max,
            min: min === Number.POSITIVE_INFINITY ? 0 : min,
            days: finalResponse.reduce(
                (acc, curr) => {
                    acc[Number(curr.day)] = {
                        current: Number(curr.current),
                        future: Number(curr.future),
                    }
                    return acc
                },
                {} as Record<number, { current: number; future: number }>
            ),
        }
    }
}

export default MovementService
