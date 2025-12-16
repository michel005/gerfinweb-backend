import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { ErrorCode } from 'src/constant/ErrorCode'
import { User } from 'src/entity/User'

export class UpdatePasswordUserDTO {
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @ApiProperty({
        description: 'Senha atual do usuário',
        example: 'senha123',
    })
    oldPassword: User['password']

    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @ApiProperty({
        description: 'Nova senha do usuário',
        example: 'novaSenha123',
    })
    newPassword: User['password']

    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @ApiProperty({
        description: 'Confirmação da nova senha do usuário',
        example: 'novaSenha123',
    })
    passwordConfirmation: User['password']
}
