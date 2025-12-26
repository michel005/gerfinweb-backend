import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'
import { User } from '@/entity/User'
import { IsNotFutureDate } from '@/validation/IsNotFutureDate'

export class UpdateUserDTO {
    @ApiProperty({
        description: 'Base64 da foto de perfil do usuário',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @Matches(/^data:image\/(?:png|jpg|jpeg|gif|webp);base64,/, { message: ErrorCode.GENERAL_INVALID_BASE64_FIELD })
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
