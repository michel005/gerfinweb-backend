import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { AbstractUserEntity } from '@/entity/AbstractUserEntity'
import { Category } from '@/entity/Category'

@Entity('Budget')
export class Budget extends AbstractUserEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'text' })
    description: string

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    amount: number

    @Column({ type: 'date', nullable: true })
    startDate?: Date

    @Column({ type: 'date', nullable: true })
    endDate?: Date

    @ManyToMany(() => Category)
    @JoinTable({ name: 'Budget_Categories' })
    categories: Category[]

    @Column({ type: 'enum', enum: ['active', 'inactive', 'completed'], default: 'active' })
    status: 'active' | 'inactive' | 'completed'

    static fromDTO(dto: any) {
        const budget = new Budget()
        budget.name = dto.name
        budget.description = dto.description
        budget.amount = dto.amount
        budget.startDate = dto.startDate
        budget.endDate = dto.endDate
        budget.categories = dto.categoryIds.map((x) => {
            const category = new Category()
            category.id = x
            return category
        })
        budget.status = dto.status
        return budget
    }

    toDTO() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            amount: this.amount,
            startDate: this.startDate,
            endDate: this.endDate,
            categories: this.categories.map((x) => x.toDTO()),
            status: this.status,
        }
    }
}
