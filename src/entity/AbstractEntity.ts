import { ApiProperty } from '@nestjs/swagger'
import { BeforeInsert, BeforeUpdate, CreateDateColumn, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export abstract class AbstractEntity {
    @PrimaryColumn()
    id: string

    @ApiProperty({
        description: 'Data de cadastro',
        example: '2023-01-01T00:00:00.000Z',
    })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @ApiProperty({
        description: 'Data de atualização',
        example: '2023-01-01T00:00:00.000Z',
    })
    @CreateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date

    @BeforeInsert()
    async beforeInsert() {
        this.id = uuidv4()
        this.createdAt = new Date()
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.updatedAt = new Date()
    }
}
