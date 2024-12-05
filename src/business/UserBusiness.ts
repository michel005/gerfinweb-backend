import { UserType } from '../types/UserType'
import { Database } from '../database/Database'
import { UserTokenBusiness } from './UserTokenBusiness'
import { LoginType } from '../types/LoginType'
import { ErrorCollection } from '../types/ErrorCollection'
import { UserRecoveryBusiness } from './UserRecoveryBusiness'
import { Business } from './Business'

export class UserBusiness {
    public database: Database<UserType> = new Database<UserType>('user')

    public login = ({ email, password }: LoginType) => {
        const users = this.database.find(
            (x) => x.email === email && x.password === password
        )
        if (users.length > 0) {
            return Business.userToken.createToken({ user_id: users[0].id })
        } else {
            ErrorCollection.simple('error', 'USER-008')
        }
    }

    private validate = ({
        errors,
        entity,
    }: {
        errors: ErrorCollection
        entity: any
    }) => {
        if (!entity.full_name) {
            errors.add('full_name', 'VALIDATION-001')
        }
        if (!entity.birthday) {
            errors.add('birthday', 'VALIDATION-001')
        }
        if (!entity.person_type) {
            errors.add('person_type', 'VALIDATION-001')
        }
        if (!entity.document_type) {
            errors.add('document_type', 'VALIDATION-001')
        }
        if (!entity.document_number) {
            errors.add('document_number', 'VALIDATION-001')
        }
        if (entity.address) {
            if (!entity.address.city) {
                errors.add('address.city', 'VALIDATION-001')
            }
            if (!entity.address.state) {
                errors.add('address.state', 'VALIDATION-001')
            }
            if (!entity.address.country) {
                errors.add('address.country', 'VALIDATION-001')
            }
        }
    }

    private validateCreate = ({ entity }: { entity: any }) => {
        const errors = new ErrorCollection()

        if (!entity.password) {
            errors.add('password', 'VALIDATION-001')
        }
        this.validate({ errors, entity })

        errors.throw()
    }

    private validateUpdate = ({ entity }: { entity: any }) => {
        const errors = new ErrorCollection()

        this.validate({ errors, entity })

        errors.throw()
    }

    public create = ({ user }: { user: Omit<UserType, 'id'> }) => {
        this.validateCreate({ entity: user })
        const sameEmail = this.database.find((x) => x.email === user.email)
        if (sameEmail.length > 0) {
            ErrorCollection.simple('email', 'USER-005')
        }
        this.database.save({
            picture: user.picture,
            full_name: user.full_name,
            email: user.email,
            birthday: user.birthday,
            password: user.password,
            address: {
                zip_code: user.address?.zip_code,
                street_name: user.address?.street_name,
                street_number: user.address?.street_number,
                complement: user.address?.complement,
                neighborhood: user.address?.neighborhood,
                city: user.address?.city,
                state: user.address?.state,
                country: user.address?.country,
            },
            settings: {
                color_schema: user.settings?.color_schema,
            },
        })
    }

    public update = ({
        currentUser,
        user,
    }: {
        currentUser?: UserType
        user: Omit<UserType, 'id'>
    }) => {
        this.validateUpdate({ entity: user })
        return this.database.save({
            ...currentUser,
            picture: user.picture,
            full_name: user.full_name,
            birthday: user.birthday,
            person_type: user.person_type,
            document_type: user.document_type,
            document_number: user.document_number,
            biography: user.biography,
            phone: user.phone,
            address: {
                zip_code: user.address?.zip_code,
                street_name: user.address?.street_name,
                street_number: user.address?.street_number,
                complement: user.address?.complement,
                neighborhood: user.address?.neighborhood,
                city: user.address?.city,
                state: user.address?.state,
                country: user.address?.country,
            },
            settings: {
                color_schema: user.settings?.color_schema,
            },
        })
    }

    public updatePassword = ({
        currentUser,
        current,
        new_password,
        confirmation,
    }: {
        currentUser?: UserType
        current?: string
        new_password?: string
        confirmation?: string
    }) => {
        if (!currentUser) {
            return
        }
        const errors = new ErrorCollection()

        if (currentUser?.password !== current) {
            errors.add('current', 'USER-009')
        }

        if (new_password !== confirmation) {
            errors.add('new_password', 'USER-010')
        }

        errors.throw()

        Business.userToken.removeByUserId({ userId: currentUser?.id })
        this.database.save({
            ...currentUser,
            password: new_password,
        })
    }

    public remove = ({
        currentUser,
        password,
    }: {
        currentUser?: UserType
        password?: string
    }) => {
        if (currentUser?.password !== password) {
            ErrorCollection.simple('password', 'USER-007')
        }
        Business.userRecovery.removeByUserId({ userId: currentUser?.id })
        Business.userToken.removeByUserId({ userId: currentUser?.id })
        return this.database.remove(currentUser?.id)
    }
}
