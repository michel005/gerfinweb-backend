import { ManyToOne } from 'typeorm'
import { AbstractEntity } from './AbstractEntity'
import { User } from './User'

export abstract class AbstractUserEntity extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
    user: User

    abstract toDTO(): any
}
