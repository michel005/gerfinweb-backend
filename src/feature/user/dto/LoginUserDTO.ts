import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ErrorCode } from 'src/constant/ErrorCode'
import { User } from 'src/entity/User'

export class LoginUserDTO {
    @ApiProperty({
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
}
