import { ApiProperty } from '@nestjs/swagger'
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator'
import { ErrorCode } from 'src/constant/ErrorCode'
import { User } from 'src/entity/User'
import { IsNotFutureDate } from 'src/validation/IsNotFutureDate'

export class CreateUserDTO {
    @ApiProperty({
        description: 'URL da foto de perfil do usuário',
        example: 'https://example.com/profile.jpg',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @IsUrl({}, { message: ErrorCode.GENERAL_INVALID_URL_FIELD })
    profilePicture: User['profilePicture']

    @ApiProperty({
        description: 'Nome completo do usuário',
        example: 'João da Silva',
    })
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    fullName: User['fullName']

    @ApiProperty({
        description: 'Data de nascimento do usuário no formato YYYY-MM-DD',
        example: '1990-01-01',
    })
    @IsOptional()
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsDateString({}, { message: ErrorCode.GENERAL_INVALID_DATE_FIELD })
    @IsNotFutureDate({
        message: 'A data de nascimento não pode ser uma data futura',
    })
    birthDate: User['birthDate']

    @ApiProperty({
        uniqueItems: true,
        description: 'Email do usuário',
        example: 'joao.silva@example.com',
    })
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsEmail({}, { message: ErrorCode.GENERAL_INVALID_EMAIL_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    email: User['email']

    @ApiProperty({
        description: 'Senha do usuário',
        example: 'senha123',
    })
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    password: User['password']

    @ApiProperty({
        description: 'Confirmação de senha do usuário',
        example: 'senha123',
    })
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    passwordConfirmation: User['password']
}
