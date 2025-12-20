import { ApiProperty } from '@nestjs/swagger'
import { BankAccountType } from '@/constant/BankAccountType'

export class ResponseBankAccountDTO {
    @ApiProperty({
        description: 'Data de criação do usuário',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: 'Data de atualização do usuário',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date

    @ApiProperty({
        description: 'ID da conta bancária',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    id: string

    @ApiProperty({
        description: 'Nome da conta bancária',
        example: 'Minha Conta Bancária',
        required: true,
    })
    name: string

    @ApiProperty({
        description: 'Tipo da conta bancária',
        example: 'Salary',
        enum: BankAccountType,
        required: true,
    })
    type: keyof typeof BankAccountType

    @ApiProperty({
        description: 'Cor da conta bancária',
        example: '#FF5733',
        required: false,
    })
    color?: string
}
