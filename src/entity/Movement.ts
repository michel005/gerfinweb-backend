import { RecurrenceType } from '@/constant/RecurrenceType'
import { UpdateRecurrenceDTO } from '@/feature/recurrences/dto'
import { CreateRecurrenceDTO } from '@/feature/recurrences/dto/CreateRecurrenceDTO'
import { Column, Entity, ManyToOne } from 'typeorm'
import { AbstractUserEntity } from './AbstractUserEntity'
import { BankAccount } from './BankAccount'

@Entity('Movement')
export class Movement extends AbstractUserEntity {
    @Column({ type: 'date', nullable: false })
    date: Date

    @Column({ type: 'date', nullable: false })
    dueDate: Date

    @Column({ type: 'varchar', length: 255, nullable: false })
    description: string

    @Column({ type: 'simple-array', nullable: false })
    categories: string[]

    @Column({
        type: 'enum',
        nullable: false,
        enum: RecurrenceType,
    })
    type: RecurrenceType

    @ManyToOne(() => BankAccount, { nullable: false })
    originBankAccount: BankAccount

    @ManyToOne(() => BankAccount, { nullable: false })
    destinationBankAccount: BankAccount

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
    value: number

    static fromDTO(dto: any): Movement {
        const recurrence = new Movement()
        recurrence.description = dto.description
        recurrence.categories = dto.categories
        recurrence.type = dto.type
        recurrence.value = dto.value
        recurrence.originBankAccount = new BankAccount()
        recurrence.originBankAccount.id = dto.originBankAccountId
        recurrence.destinationBankAccount = new BankAccount()
        recurrence.destinationBankAccount.id = dto.destinationBankAccountId
        return recurrence
    }

    toDTO() {
        return {
            date: this.date,
            dueDate: this.dueDate,
            id: this.id,
            description: this.description,
            categories: this.categories,
            type: this.type,
            originBankAccount: this.originBankAccount,
            destinationBankAccount: this.destinationBankAccount,
            value: this.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
