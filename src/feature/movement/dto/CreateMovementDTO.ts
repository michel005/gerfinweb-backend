import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'

export class CreateMovementDTO {
    @ApiProperty({
        description: 'Data da movimentação',
        example: '2024-06-30',
    })
    @IsOptional()
    @IsDateString({}, { message: ErrorCode.GENERAL_INVALID_DATE_FIELD })
    date: Date

    @ApiProperty({
        description: 'Data de vencimento da movimentação',
        example: '2024-07-05',
    })
    @IsOptional()
    @IsDateString({}, { message: ErrorCode.GENERAL_INVALID_DATE_FIELD })
    dueDate: Date

    @ApiProperty({
        description: 'Descrição da movimentação',
        example: 'Pagamento de conta de luz',
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    description: string

    @ApiProperty({
        description: 'ID da categoria associada à movimentação',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        type: String,
    })
    @IsOptional()
    categoryId?: string

    @ApiProperty({
        description: 'ID da recorrência associada à movimentação',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    })
    @IsOptional()
    @IsString({
        each: true,
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    recurrenceId?: string

    @ApiProperty({
        description: 'Conta bancária de origem',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        required: true,
    })
    @IsString({
        each: true,
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    originBankAccountId: string

    @ApiProperty({
        description: 'Conta bancária de destino',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    })
    @IsOptional()
    @IsString({
        each: true,
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    destinationBankAccountId: string

    @ApiProperty({
        description: 'Valor da movimentação',
        example: 150.75,
    })
    @IsNumber(
        {},
        {
            message: ErrorCode.GENERAL_INVALID_NUMBER_FIELD,
        }
    )
    value: number
}
