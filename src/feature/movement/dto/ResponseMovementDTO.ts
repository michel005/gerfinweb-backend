import { ApiProperty } from '@nestjs/swagger'
import { ResponseBankAccountDTO } from '@/feature/bankAccount/dto'
import { ResponseRecurrenceDTO } from '@/feature/recurrences/dto'
import { ResponseCategoryDTO } from '@/feature/category/dto'

export class ResponseMovementDTO {
    @ApiProperty({
        description: 'ID da conta bancária',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    id?: string

    @ApiProperty({
        description: 'Data de criação do usuário',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt?: string

    @ApiProperty({
        description: 'Data de atualização do usuário',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt?: string

    @ApiProperty({
        description: 'Data da movimentação',
        example: '2024-06-30',
    })
    date?: string

    @ApiProperty({
        description: 'Descrição da movimentação',
        example: 'Pagamento de conta de luz',
    })
    description: string

    @ApiProperty({
        description: 'Categorias associadas à movimentação',
        type: () => ResponseCategoryDTO,
    })
    category?: ResponseCategoryDTO

    @ApiProperty({
        description: 'Recorrência associada à movimentação',
        type: () => ResponseRecurrenceDTO,
    })
    recurrence?: ResponseRecurrenceDTO

    @ApiProperty({
        description: 'Conta bancária de origem',
        type: () => ResponseBankAccountDTO,
    })
    originBankAccount?: ResponseBankAccountDTO

    @ApiProperty({
        description: 'Conta bancária de destino',
        type: () => ResponseBankAccountDTO,
    })
    destinationBankAccount?: ResponseBankAccountDTO

    @ApiProperty({
        description: 'Valor da movimentação',
        example: 150.75,
    })
    value: number

    @ApiProperty({
        description: 'Status da movimentação',
        enum: ['LATE', 'APPROVED', 'PENDENT'],
    })
    status?: 'LATE' | 'APPROVED' | 'PENDENT'

    @ApiProperty({
        description: 'Indica se a movimentação está aprovada',
        example: false,
        default: false,
    })
    approved: boolean
}
