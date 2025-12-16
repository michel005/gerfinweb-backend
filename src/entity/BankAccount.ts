import { BankAccountType, BankAccountTypeValues } from 'src/constant/BankAccountType'
import { CreateBankAccountDTO, ResponseBankAccountDTO } from 'src/feature/bankAccount/dto'
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

    static fromDTO(dto: CreateBankAccountDTO): BankAccount {
        const bankAccount = new BankAccount()
        bankAccount.name = dto.name
        bankAccount.type = dto.type
        bankAccount.color = dto.color
        return bankAccount
    }

    toDTO(): ResponseBankAccountDTO {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            color: this.color,
        }
    }
}
