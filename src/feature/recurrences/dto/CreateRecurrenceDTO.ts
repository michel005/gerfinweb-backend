import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'
import { RecurrenceType } from '@/constant/RecurrenceType'

export class CreateRecurrenceDTO {
    @ApiProperty({
        description: 'Descrição da recorrência',
        example: 'Assinatura de Streaming',
        required: true,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    description: string

    @ApiProperty({
        description: 'Dia do mês em que a recorrência ocorre',
        example: 15,
        required: true,
    })
    @IsNumber(
        {},
        {
            message: ErrorCode.GENERAL_INVALID_NUMBER_FIELD,
        }
    )
    day: number

    @ApiProperty({
        description: 'ID da conta bancária de origem da recorrência',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        required: true,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    originBankAccountId: string

    @ApiProperty({
        description: 'Categorias associadas à recorrência',
        example: ['Entretenimento', 'Assinaturas'],
        required: true,
    })
    @IsString({
        each: true,
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    categories: string[]

    @ApiProperty({
        description: 'Tipo da recorrência',
        example: 'MONTHLY',
        enum: RecurrenceType,
        required: true,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsEnum(Object.keys(RecurrenceType), {
        message: ErrorCode.GENERAL_INVALID_ENUM_FIELD,
    })
    type: keyof typeof RecurrenceType

    @ApiProperty({
        description: 'Valor da recorrência',
        example: 29.99,
        required: true,
    })
    @IsNumber(
        {},
        {
            message: ErrorCode.GENERAL_INVALID_NUMBER_FIELD,
        }
    )
    value: number
}
