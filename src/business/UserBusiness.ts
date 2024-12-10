import { Database } from '../database/Database'
import { LoginType } from '../types/LoginType'
import { ErrorCollection } from '../types/ErrorCollection'
import { Business } from './Business'
import { randomUUID } from 'node:crypto'
import { DateUtils } from '../utils/DateUtils'
import { user } from '@prisma/client'

export class UserBusiness {
    private client = Database.prismaClient

    public select = {
        id: true,
        full_name: true,
        birthday: true,
        person_type: true,
        document_type: true,
        document_number: true,
        phone: true,
        email: true,
        password: true,
        address_id: true,
        address: {
            select: {
                zip_code: true,
                street_name: true,
                street_number: true,
                complement: true,
                neighborhood: true,
                city: true,
                state: true,
                country: true,
            },
        },
        setting_id: true,
        user_setting: {
            select: {
                color_schema: true,
            },
        },
    }

    public publicSelect = {
        full_name: true,
        birthday: true,
        person_type: true,
        document_type: true,
        document_number: true,
        phone: true,
        email: true,
        address: {
            select: {
                zip_code: true,
                street_name: true,
                street_number: true,
                complement: true,
                neighborhood: true,
                city: true,
                state: true,
                country: true,
            },
        },
        user_setting: {
            select: {
                color_schema: true,
            },
        },
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
        if (!entity.phone) {
            errors.add('phone', 'VALIDATION-001')
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

    public parseUser = ({ user }: { user: any }) => {
        return {
            ...user,
            password: undefined,
        }
    }

    public findByEmail = async ({ email }: { email?: string }) => {
        return this.client.user.findFirst({
            where: {
                email,
            },
        })
    }

    public login = async ({ email, password }: LoginType) => {
        const users = await this.client.user.findMany({
            where: {
                email,
                password,
            },
        })
        if (users.length > 0) {
            return await Business.userToken.createToken({
                userId: users?.[0].id,
            })
        } else {
            ErrorCollection.simple('error', 'USER-008')
        }
    }

    public create = async ({ user }: { user: any }) => {
        this.validateCreate({ entity: user })
        const sameEmail = await this.client.user.findMany({
            where: {
                email: user.email || '',
            },
        })

        if (sameEmail.length > 0) {
            ErrorCollection.simple('email', 'USER-005')
        }
        return this.parseUser({
            user: await this.client.user.create({
                select: this.publicSelect,
                data: {
                    id: randomUUID(),
                    full_name: user.full_name,
                    birthday: DateUtils.stringToDate(user.birthday),
                    person_type: user.person_type,
                    document_type: user.document_type,
                    document_number: user.document_number,
                    phone: user.phone,
                    email: user.email,
                    password: user.password,
                    address: {
                        create: {
                            id: randomUUID(),
                            zip_code: user.address?.zip_code,
                            street_name: user.address?.street_name,
                            street_number: user.address?.street_number,
                            complement: user.address?.complement,
                            neighborhood: user.address?.neighborhood,
                            city: user.address?.city,
                            state: user.address?.state,
                            country: user.address?.country,
                        },
                    },
                    user_setting: {
                        create: {
                            id: randomUUID(),
                            color_schema: '#3399ff',
                        },
                    },
                },
            }),
        })
    }

    public update = async ({
        currentUser,
        user,
    }: {
        currentUser: user
        user: any
    }) => {
        this.validateUpdate({ entity: user })

        return this.parseUser({
            user: await this.client.user.update({
                select: this.publicSelect,
                where: {
                    id: currentUser?.id,
                },
                data: {
                    full_name: user.full_name,
                    birthday: DateUtils.stringToDate(user.birthday),
                    person_type: user.person_type,
                    document_type: user.document_type,
                    document_number: user.document_number,
                    phone: user.phone,
                    address: {
                        update: {
                            data: {
                                zip_code: user.address?.zip_code,
                                street_name: user.address?.street_name,
                                street_number: user.address?.street_number,
                                complement: user.address?.complement,
                                neighborhood: user.address?.neighborhood,
                                city: user.address?.city,
                                state: user.address?.state,
                                country: user.address?.country,
                            },
                            where: {
                                id: currentUser?.address_id,
                            },
                        },
                    },
                    user_setting: {
                        update: {
                            data: {
                                color_schema: user.user_setting?.color_schema,
                            },
                            where: {
                                id: currentUser?.setting_id,
                            },
                        },
                    },
                },
            }),
        })
    }

    public updatePassword = async ({
        currentUser,
        current,
        new_password,
        confirmation,
    }: {
        currentUser: user
        current?: string
        new_password?: string
        confirmation?: string
    }) => {
        const errors = new ErrorCollection()

        if (currentUser.password !== current) {
            errors.add('current', 'USER-009')
        }

        if (new_password !== confirmation) {
            errors.add('new_password', 'USER-010')
        }

        errors.throw()

        await Business.userToken.removeByUserId({ userId: currentUser.id })

        await this.client.user.update({
            data: {
                password: new_password,
            },
            where: {
                id: currentUser.id,
            },
        })
    }

    public remove = async ({
        currentUser,
        password,
    }: {
        currentUser: user
        password?: string
    }) => {
        if (currentUser.password !== password) {
            ErrorCollection.simple('password', 'USER-007')
        }

        await Database.prismaClient.user_recovery.deleteMany({
            where: {
                user_id: currentUser.id,
            },
        })

        await Business.userToken.removeByUserId({ userId: currentUser.id })

        await this.client.user.delete({
            where: {
                id: currentUser.id,
            },
        })

        await this.client.address.delete({
            where: {
                id: currentUser.address_id,
            },
        })

        await this.client.user_setting.delete({
            where: {
                id: currentUser.setting_id,
            },
        })
    }
}
