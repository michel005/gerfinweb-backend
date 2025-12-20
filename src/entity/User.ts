import { CreateUserDTO, ResponseUserDTO, UpdateUserDTO } from '../feature/user/dto'
import { Column, Entity } from 'typeorm'
import { AbstractEntity } from './AbstractEntity'

@Entity('User')
export class User extends AbstractEntity {
    @Column({ type: 'text', nullable: true })
    profilePicture: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    fullName: string

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string

    @Column({ type: 'date' })
    birthDate: Date

    static fromDTO(dto: CreateUserDTO | UpdateUserDTO) {
        const user = new User()
        user.fullName = dto.fullName
        user.birthDate = dto.birthDate
        user.profilePicture = dto.profilePicture

        if (dto instanceof CreateUserDTO) {
            user.email = dto.email
            user.password = dto.password
        }

        return user
    }

    toDTO() {
        const { fullName, email, birthDate, profilePicture, createdAt, updatedAt } = this
        return {
            fullName,
            email,
            birthDate,
            profilePicture,
            createdAt,
            updatedAt,
        } as ResponseUserDTO
    }
}
