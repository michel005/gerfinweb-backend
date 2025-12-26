import { CreateUserDTO, ResponseUserDTO, UpdateUserDTO } from '../feature/user/dto'
import { Column, Entity } from 'typeorm'
import { AbstractEntity } from './AbstractEntity'

@Entity('User')
export class User extends AbstractEntity {
    @Column({ type: 'text', nullable: true })
    profilePicture: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    fullName: string

    @Column({ type: 'varchar', length: 254, nullable: false, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string

    @Column({ type: 'date' })
    birthDate: Date

    @Column({ type: 'varchar', length: 10, nullable: true })
    colorSchema: string

    @Column({ type: 'text', nullable: true })
    biography: string

    static fromDTO(dto: CreateUserDTO | UpdateUserDTO) {
        const user = new User()
        user.fullName = dto.fullName
        user.birthDate = dto.birthDate
        user.profilePicture = dto.profilePicture
        user.colorSchema = dto.colorSchema
        user.biography = dto.biography

        if (dto instanceof CreateUserDTO) {
            user.email = dto.email
            user.password = dto.password
        }

        return user
    }

    toDTO() {
        const { fullName, email, birthDate, profilePicture, createdAt, updatedAt, colorSchema, biography } = this
        return {
            fullName,
            email,
            birthDate,
            profilePicture,
            createdAt,
            updatedAt,
            colorSchema,
            biography,
        } as ResponseUserDTO
    }
}
