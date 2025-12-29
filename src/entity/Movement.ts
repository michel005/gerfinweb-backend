import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AbstractUserEntity } from './AbstractUserEntity'
import { BankAccount } from './BankAccount'
import { CreateMovementDTO, UpdateMovementDTO } from '@/feature/movement/dto'
import { Recurrence } from '@/entity/Recurrence'
import { Category } from '@/entity/Category'

@Entity('Movement')
export class Movement extends AbstractUserEntity {
    @Column({ type: 'date', nullable: true })
    date: Date

    @Column({ type: 'date', nullable: false })
    dueDate: Date

    @Column({ type: 'varchar', length: 255, nullable: false })
    description: string

    @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category?: Category | null

    @ManyToOne(() => Recurrence, { nullable: true, onDelete: 'SET NULL' })
    recurrence?: Recurrence | null

    @ManyToOne(() => BankAccount, { nullable: false })
    originBankAccount: BankAccount

    @ManyToOne(() => BankAccount, { nullable: true, onDelete: 'SET NULL' })
    destinationBankAccount?: BankAccount | null

    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    value: number

    status: string

    calculateStatus(): 'LATE' | 'APPROVED_LATE' | 'APPROVED' | 'PENDENT' {
        const dueDate = new Date(this.dueDate.toString().split('T')[0])
        const today = new Date(new Date().toISOString().split('T')[0])
        if (this.date) {
            const date = new Date(this.date.toString().split('T')[0])
            if (date.getTime() >= today.getTime()) {
                if (date.getTime() <= dueDate.getTime()) {
                    return 'APPROVED'
                } else {
                    return 'APPROVED_LATE'
                }
            } else {
                return 'APPROVED_LATE'
            }
        } else {
            if (dueDate.getTime() >= today.getTime()) {
                return 'PENDENT'
            } else {
                return 'LATE'
            }
        }
    }

    static fromDTO(dto: CreateMovementDTO | UpdateMovementDTO): Movement {
        const movement = new Movement()
        movement.date = dto.date
        movement.dueDate = dto.dueDate
        movement.description = dto.description
        movement.value = dto.value
        if (dto.categoryId) {
            movement.category = new Category()
            movement.category.id = dto.categoryId
        }
        if (dto.recurrenceId) {
            movement.recurrence = new Recurrence()
            movement.recurrence.id = dto.recurrenceId
        }
        if (dto.categoryId) {
            movement.category = new Category()
            movement.category.id = dto.categoryId
        }
        if (dto.originBankAccountId) {
            movement.originBankAccount = new BankAccount()
            movement.originBankAccount.id = dto.originBankAccountId
        }
        if (dto.destinationBankAccountId) {
            movement.destinationBankAccount = new BankAccount()
            movement.destinationBankAccount.id = dto.destinationBankAccountId
        }
        return movement
    }

    toDTO() {
        return {
            id: this.id,
            date: this.date,
            dueDate: this.dueDate,
            description: this.description,
            category: this.category ? this.category.toDTO() : undefined,
            recurrence: this.recurrence ? this.recurrence.toDTO() : undefined,
            originBankAccount: this.originBankAccount ? this.originBankAccount.toDTO() : undefined,
            destinationBankAccount: this.destinationBankAccount ? this.destinationBankAccount.toDTO() : undefined,
            value: this.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            status: this.calculateStatus(),
        }
    }
}
