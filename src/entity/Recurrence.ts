import { RecurrenceType } from '@/constant/RecurrenceType'
import { CreateRecurrenceDTO } from '@/feature/recurrences/dto/CreateRecurrenceDTO'
import { ResponseRecurrenceDTO } from '@/feature/recurrences/dto/ResponseRecurrenceDTO'
import { Column, Entity, ManyToOne } from 'typeorm'
import { AbstractUserEntity } from './AbstractUserEntity'
import { BankAccount } from './BankAccount'
import { UpdateRecurrenceDTO } from '@/feature/recurrences/dto'

@Entity('Recurrence')
export class Recurrence extends AbstractUserEntity {
    @Column({ type: 'int', nullable: false })
    day: number

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

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
    value: number

    static fromDTO(dto: CreateRecurrenceDTO | UpdateRecurrenceDTO): Recurrence {
        const recurrence = new Recurrence()
        recurrence.day = dto.day
        recurrence.description = dto.description
        recurrence.categories = dto.categories
        recurrence.type = dto.type
        recurrence.value = dto.value
        recurrence.originBankAccount = new BankAccount()
        recurrence.originBankAccount.id = dto.originBankAccountId
        return recurrence
    }

    toDTO(): ResponseRecurrenceDTO {
        return {
            id: this.id,
            day: this.day,
            description: this.description,
            categories: this.categories,
            type: this.type,
            originBankAccount: this.originBankAccount,
            value: this.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
