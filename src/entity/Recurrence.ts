import { RecurrenceType } from '@/constant/RecurrenceType'
import { CreateRecurrenceDTO } from '@/feature/recurrences/dto/CreateRecurrenceDTO'
import { ResponseRecurrenceDTO } from '@/feature/recurrences/dto/ResponseRecurrenceDTO'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AbstractUserEntity } from './AbstractUserEntity'
import { BankAccount } from './BankAccount'
import { UpdateRecurrenceDTO } from '@/feature/recurrences/dto'
import { Category } from '@/entity/Category'

@Entity('Recurrence')
export class Recurrence extends AbstractUserEntity {
    @Column({ type: 'int', nullable: false })
    day: number

    @Column({ type: 'varchar', length: 255, nullable: false })
    description: string

    @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category?: Category | null

    @Column({
        type: 'enum',
        nullable: true,
        enum: RecurrenceType,
    })
    type: RecurrenceType

    @ManyToOne(() => BankAccount, { nullable: true })
    originBankAccount?: BankAccount | null

    @ManyToOne(() => BankAccount, { nullable: true })
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

    static fromDTO(dto: CreateRecurrenceDTO | UpdateRecurrenceDTO): Recurrence {
        const recurrence = new Recurrence()
        recurrence.day = dto.day
        recurrence.description = dto.description
        if (dto.categoryId) {
            recurrence.category = new Category()
            recurrence.category.id = dto.categoryId
        } else {
            recurrence.category = null
        }
        recurrence.type = dto.type
        recurrence.value = dto.value
        if (dto.originBankAccountId) {
            recurrence.originBankAccount = new BankAccount()
            recurrence.originBankAccount.id = dto.originBankAccountId
        } else {
            recurrence.originBankAccount = null
        }
        if (dto.destinationBankAccountId) {
            recurrence.destinationBankAccount = new BankAccount()
            recurrence.destinationBankAccount.id = dto.destinationBankAccountId
        } else {
            recurrence.destinationBankAccount = null
        }
        return recurrence
    }

    toDTO(): ResponseRecurrenceDTO {
        return {
            id: this.id,
            day: this.day,
            description: this.description,
            category: this.category ? this.category.toDTO() : undefined,
            type: this.type,
            originBankAccount: this.originBankAccount ? this.originBankAccount.toDTO() : undefined,
            destinationBankAccount: this.destinationBankAccount ? this.destinationBankAccount.toDTO() : undefined,
            value: this.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
