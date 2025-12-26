import { AbstractUserEntity } from '@/entity/AbstractUserEntity'
import { Column, Entity } from 'typeorm'

@Entity('Category')
export class Category extends AbstractUserEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string

    @Column({ type: 'text', nullable: true })
    description?: string

    @Column({ type: 'varchar', length: 7, nullable: true })
    color?: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    icon?: string

    static fromDTO(dto: Partial<Category>) {
        const category = new Category()
        Object.assign(category, dto)
        return category
    }

    toDTO() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            color: this.color,
            icon: this.icon,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
