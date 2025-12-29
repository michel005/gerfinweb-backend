import { BadRequestException, Injectable } from '@nestjs/common'
import { Movement } from '@/entity/Movement'
import { CreateMovementDTO, ResponseMovementDTO, UpdateMovementDTO } from '@/feature/movement/dto'
import { BankAccount } from '@/entity/BankAccount'
import { ResponseRecurrenceDTO } from '@/feature/recurrences/dto'
import { Category } from '@/entity/Category'
import { AbstractService } from '@/feature/AbstractService'
import { Recurrence } from '@/entity'

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
        existingMovement.dueDate = movement.dueDate
        existingMovement.value = movement.value
        existingMovement.originBankAccount = new BankAccount()
        existingMovement.originBankAccount.id = movement.originBankAccountId
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
        existingMovement.date = new Date()
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
            .andWhere('EXTRACT(MONTH FROM movement.dueDate) = :month', { month })
            .andWhere('EXTRACT(YEAR FROM movement.dueDate) = :year', { year })
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
            .andWhere('EXTRACT(MONTH FROM movement.dueDate) = :month', { month })
            .andWhere('EXTRACT(YEAR FROM movement.dueDate) = :year', { year })
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
                'movement.userId = :userId AND MONTH(movement.dueDate) = :month AND YEAR(movement.dueDate) = :year AND movement.date IS NULL',
                { userId, month, year }
            )
            .orderBy('movement.createdAt', 'DESC')
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
}

export default MovementService
