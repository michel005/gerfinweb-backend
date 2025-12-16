import { BeforeInsert, CreateDateColumn, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export abstract class AbstractEntity {
    @PrimaryColumn()
    id: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @CreateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date

    @BeforeInsert()
    async beforeInsert() {
        this.id = uuidv4()
    }
}
