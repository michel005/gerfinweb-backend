import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsHexColor, IsString } from 'class-validator'
import { BankAccountType } from '@/constant/BankAccountType'
import { ErrorCode } from '@/constant/ErrorCode'

export class CreateBankAccountDTO {
    @ApiProperty({
        description: 'Nome da conta bancária',
        example: 'Minha Conta Bancária',
        required: true,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    name: string

    @ApiProperty({
        description: 'Tipo da conta bancária',
        example: 'Salary',
        enum: BankAccountType,
        required: true,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsEnum(BankAccountType, {
        message: ErrorCode.GENERAL_INVALID_ENUM_FIELD,
    })
    type: keyof typeof BankAccountType

    @ApiProperty({
        description: 'Cor da conta bancária',
        example: '#FF5733',
        required: false,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsHexColor({
        message: ErrorCode.GENERAL_INVALID_HEX_COLOR_FIELD,
    })
    color?: string
}
