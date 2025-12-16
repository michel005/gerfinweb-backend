import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BankAccountType } from 'src/constant/BankAccountType'
import { ErrorCode } from 'src/constant/ErrorCode'
import { PaginationDTO } from 'src/dto/PaginationDTO'

export class GetAllBankAccountDTO extends PaginationDTO {
    @ApiProperty({
        description: 'Nome da conta bancária',
    })
    @IsOptional()
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    name?: string

    @ApiProperty({
        description: 'Tipo da conta bancária',
        enum: BankAccountType,
    })
    @IsOptional()
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsEnum(BankAccountType, {
        message: ErrorCode.GENERAL_INVALID_ENUM_FIELD,
    })
    type?: keyof typeof BankAccountType
}
