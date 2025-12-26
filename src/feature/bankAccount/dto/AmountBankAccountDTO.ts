import { ResponseBankAccountDTO } from '@/feature/bankAccount/dto/ResponseBankAccountDTO'
import { ApiProperty } from '@nestjs/swagger'

export class AmountBankAccountDTO {
    @ApiProperty({
        description: 'Conta bancária',
        type: ResponseBankAccountDTO,
    })
    bankAccount: ResponseBankAccountDTO

    @ApiProperty({
        description: 'Saldo futuro da conta bancária',
        example: 1500.75,
    })
    future: number

    @ApiProperty({
        description: 'Saldo atual da conta bancária',
        example: 1200.5,
    })
    current: number
}
