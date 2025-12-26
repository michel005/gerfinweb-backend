import { ApiProperty } from '@nestjs/swagger'
import { User } from '@/entity/User'

export class ResponseUserDTO {
    @ApiProperty({
        description: 'Data de criação do usuário',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date
    @ApiProperty({
        description: 'Data de atualização do usuário',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date

    @ApiProperty({
        description: 'URL da foto de perfil do usuário',
        example: 'https://example.com/profile.jpg',
    })
    profilePicture: User['profilePicture']

    @ApiProperty({
        description: 'Nome completo do usuário',
        example: 'João da Silva',
    })
    fullName: User['fullName']

    @ApiProperty({
        description: 'Data de nascimento do usuário no formato YYYY-MM-DD',
        example: '1990-01-01',
    })
    birthDate: User['birthDate']

    @ApiProperty({
        uniqueItems: true,
        description: 'Email do usuário',
        example: 'joao.silva@example.com',
    })
    email: User['email']

    @ApiProperty({
        description: 'Cor preferida do usuário',
        example: '#3399ff',
    })
    colorSchema: User['colorSchema']

    @ApiProperty({
        description: 'Biografia do usuário',
        example: 'Apaixonado por tecnologia e programação.',
    })
    biography: User['biography']
}
