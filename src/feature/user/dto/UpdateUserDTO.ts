import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'
import { User } from '@/entity/User'
import { IsNotFutureDate } from '@/validation/IsNotFutureDate'

export class UpdateUserDTO {
    @IsOptional()
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @IsUrl({}, { message: ErrorCode.GENERAL_INVALID_URL_FIELD })
    @ApiProperty({
        description: 'URL da foto de perfil do usuário',
        example: 'https://example.com/profile.jpg',
    })
    profilePicture: User['profilePicture']

    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @ApiProperty({
        description: 'Nome completo do usuário',
        example: 'João da Silva',
    })
    fullName: User['fullName']

    @IsOptional()
    @IsDateString({}, { message: ErrorCode.GENERAL_INVALID_DATE_FIELD })
    @IsNotFutureDate({
        message: 'A data de nascimento não pode ser uma data futura',
    })
    @ApiProperty({
        description: 'Data de nascimento do usuário no formato YYYY-MM-DD',
        example: '1990-01-01',
    })
    birthDate: User['birthDate']
}
