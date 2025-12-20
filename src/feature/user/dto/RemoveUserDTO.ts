import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'
import { User } from '@/entity/User'

export class RemoveUserDTO {
    @IsNotEmpty({ message: ErrorCode.GENERAL_MANDATORY_FIELD })
    @IsString({ message: ErrorCode.GENERAL_INVALID_STRING_FIELD })
    @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
    password: User['password']
}
