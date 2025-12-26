import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'
import { User } from '@/entity/User'
import { IsNotFutureDate } from '@/validation/IsNotFutureDate'
import { IsPasswordValid } from '@/validation/IsPasswordValid'

export class CreateUserDTO {
    @ApiProperty({
        description: 'Base64 da foto de perfil do usuário',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @Matches(/^data:image\/(?:png|jpg|jpeg|gif|webp);base64,/, { message: ErrorCode.GENERAL_INVALID_BASE64_FIELD })
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
    @IsPasswordValid({
        minLength: 8,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumber: true,
        hasSpecialChar: true,
    })
    password: User['password']

    @ApiProperty({
        description: 'Confirmação de senha do usuário',
        example: 'senha123',
    })
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @IsPasswordValid({
        minLength: 8,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumber: true,
        hasSpecialChar: true,
    })
    passwordConfirmation: User['password']

    @ApiProperty({
        description: 'Cor preferida do usuário',
        example: '#3399ff',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    colorSchema: User['colorSchema']

    @ApiProperty({
        description: 'Biografia do usuário',
        example: 'Apaixonado por tecnologia e programação.',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    biography: User['biography']
}
