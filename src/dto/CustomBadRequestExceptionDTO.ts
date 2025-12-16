import { ApiProperty } from '@nestjs/swagger'

export class CustomBadRequestExceptionDTO {
    @ApiProperty({
        description: 'Mensagem de erro',
        example: 'Dados inválidos',
    })
    message: string
    @ApiProperty({
        description: 'Detalhes do erro',
        example: {
            x: 'Exemplo de erro!',
            y: 'Outro exemplo de erro!',
        },
    })
    details: Record<string, string>
    @ApiProperty({
        description: 'Tipo de erro',
        example: 'Bad Request',
    })
    error: string
    @ApiProperty({
        description: 'Código de status',
        example: 400,
    })
    statusCode: number
}
