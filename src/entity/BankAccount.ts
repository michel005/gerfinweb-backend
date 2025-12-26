import { BankAccountType, BankAccountTypeValues } from '@/constant/BankAccountType'
import { ResponseBankAccountDTO } from '@/feature/bankAccount/dto'
import { Column, Entity } from 'typeorm'
import { AbstractUserEntity } from './AbstractUserEntity'

@Entity('BankAccount')
export class BankAccount extends AbstractUserEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string

    @Column({
        type: 'enum',
        nullable: false,
        enum: BankAccountTypeValues,
    })
    type: keyof typeof BankAccountType

    @Column({ type: 'varchar', length: 7, default: '#000000' })
    color?: string

    @Column({ type: 'boolean', default: true })
    active?: boolean

    static fromDTO(dto: any): BankAccount {
        const bankAccount = new BankAccount()
        bankAccount.name = dto.name
        bankAccount.type = dto.type
        bankAccount.color = dto.color
        bankAccount.active = dto.active ?? true
        return bankAccount
    }

    toDTO(): ResponseBankAccountDTO {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            color: this.color,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            active: this.active,
        }
    }
}
