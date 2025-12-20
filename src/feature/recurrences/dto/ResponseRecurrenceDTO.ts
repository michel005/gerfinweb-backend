import { ApiProperty } from '@nestjs/swagger'
import { RecurrenceType } from '@/constant/RecurrenceType'
import { ResponseBankAccountDTO } from '@/feature/bankAccount/dto'

export class ResponseRecurrenceDTO {
    @ApiProperty({
        description: 'Identificador único da recorrência',
        example: 'uuid-da-recorrencia',
    })
    id: string

    @ApiProperty({
        description: 'Data de cadastro',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: 'Data de atualização',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date

    @ApiProperty({
        description: 'Dia do mês em que a recorrência ocorre',
        example: 15,
        required: true,
    })
    day: number

    @ApiProperty({
        description: 'Descrição da recorrência',
        example: 'Assinatura de Streaming',
        required: true,
    })
    description: string

    @ApiProperty({
        description: 'Categorias associadas à recorrência',
        example: ['Entretenimento', 'Assinaturas'],
        required: true,
    })
    categories: string[]

    @ApiProperty({
        description: 'Tipo da recorrência',
        example: 'Monthly',
        enum: RecurrenceType,
        required: true,
    })
    type: RecurrenceType

    @ApiProperty({
        description: 'Conta bancária de origem da recorrência',
        required: true,
    })
    originBankAccount: ResponseBankAccountDTO

    @ApiProperty({
        description: 'Valor da recorrência',
        example: 29.99,
        required: true,
    })
    value: number
}
