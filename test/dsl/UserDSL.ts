import { AbstractDSL } from './AbstractDSL'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CreateUserDTO, LoginUserDTO } from '@/feature/user/dto'
import { Test } from '@nestjs/testing'
import { DSL } from './DSL'

export class UserDSL extends AbstractDSL {
    userData: any
    loginData: any
    loginTokenData: string | null
    response: Test
    updatePasswordData: any
    deletePassword: string | null

    constructor(app: INestApplication, root: DSL) {
        super(app, root, {
            userData: async (userData: CreateUserDTO) => {
                this.userData = userData
            },
            editUserData: async (editFn: (userData: any) => any) => {
                this.userData = editFn(this.userData)
            },
            loginData: async (loginData: LoginUserDTO) => {
                this.loginData = loginData
            },
            updatePasswordData: async (updatePasswordData: any) => {
                this.updatePasswordData = updatePasswordData
            },
            deletePassword: async (password: string) => {
                this.deletePassword = password
            },
            create: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest.post('/user/create').send(this.userData).expect(expectedStatus)
                } else {
                    this.response = await this.supertest.post('/user/create').send(this.userData)
                    if (expectedStatus === HttpStatus.CREATED) {
                        this.loginTokenData = (this.response as any).body.access_token
                    }
                }
            },
            update: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .patch('/user/updateInfo')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .send({
                            fullName: this.userData.fullName,
                            birthDate: this.userData.birthDate,
                            profilePicture: this.userData.profilePicture,
                        })
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .patch('/user/updateInfo')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .send({
                            fullName: this.userData.fullName,
                            birthDate: this.userData.birthDate,
                            profilePicture: this.userData.profilePicture,
                        })
                    if (expectedStatus === HttpStatus.CREATED) {
                        this.loginTokenData = (this.response as any).body.access_token
                    }
                }
            },
            updatePassword: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .patch('/user/updatePassword')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .send({
                            oldPassword: this.updatePasswordData.oldPassword,
                            newPassword: this.updatePasswordData.newPassword,
                            passwordConfirmation: this.updatePasswordData.passwordConfirmation,
                        })
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .patch('/user/updatePassword')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .send({
                            oldPassword: this.updatePasswordData.oldPassword,
                            newPassword: this.updatePasswordData.newPassword,
                            passwordConfirmation: this.updatePasswordData.passwordConfirmation,
                        })
                    if (expectedStatus === HttpStatus.CREATED) {
                        this.loginTokenData = (this.response as any).body.access_token
                    }
                }
            },
            delete: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .delete('/user/delete')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .send({ password: this.deletePassword })
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .delete('/user/delete')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .send({ password: this.deletePassword })
                }
            },
            login: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest.post('/user/login').send(this.loginData).expect(expectedStatus)
                    this.loginTokenData = (this.response as any)?.body?.access_token
                } else {
                    this.response = await this.supertest.post('/user/login').send(this.loginData)
                    this.loginTokenData = (this.response as any)?.body?.access_token
                }
            },
            me: async (expectedStatus?: HttpStatus) => {
                if (expectedStatus) {
                    this.response = await this.supertest
                        .get('/user/me')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                        .expect(expectedStatus)
                } else {
                    this.response = await this.supertest
                        .get('/user/me')
                        .set('Authorization', `Bearer ${this.loginTokenData}`)
                }
            },
            validate: async (validateFn: (response: any) => void) => {
                validateFn(this.response)
            },
        })
    }

    setUserWithEmptyData() {
        this.routeStep('Set User With Empty Data', 'userData', new CreateUserDTO())
        return this
    }

    setUserWithSimpleData() {
        const user = new CreateUserDTO()
        user.fullName = 'John Doe'
        user.email = 'example@example.com'
        user.birthDate = new Date('1990-01-01')
        user.profilePicture = 'https://example.com/profile.jpg'
        user.password = 'StrongP@ssw0rd!'
        user.passwordConfirmation = 'StrongP@ssw0rd!'
        user.colorSchema = '#3399ff'

        this.routeStep('Set User With Simple Data', 'userData', user)
        return this
    }

    setDifferentFullNameUserData() {
        this.routeStep('Update User Data With Other Full Name', 'editUserData', (x) => {
            x.fullName = 'John Doe 123'
            return x
        })
        return this
    }

    setWeakPassword() {
        this.routeStep('Set Weak Password', 'editUserData', (x) => {
            x.password = '12345'
            x.passwordConfirmation = '12345'
            return x
        })
        return this
    }

    setLoginWithSimpleData() {
        const login = new LoginUserDTO()
        login.email = 'example@example.com'
        login.password = 'StrongP@ssw0rd!'

        this.routeStep('Set Login With Simple Data', 'loginData', login)
        return this
    }

    setCorrectDeletePassword() {
        this.routeStep('Set Delete Password', 'deletePassword', 'StrongP@ssw0rd!')
        return this
    }

    setInvalidPasswordUpdateData() {
        this.routeStep('Set Invalid Password Update Data', 'updatePasswordData', {
            oldPassword: 'WrongOldP@ss',
            newPassword: 'newpass',
            passwordConfirmation: 'newpass',
        })
        return this
    }

    setInvalidPasswordConfirmationUpdateData() {
        this.routeStep('Set Invalid Password Confirmation Update Data', 'updatePasswordData', {
            oldPassword: 'StrongP@ssw0rd!',
            newPassword: 'NewStrongP@ss1',
            passwordConfirmation: 'DifferentP@ss2',
        })
        return this
    }

    setValidPasswordUpdateData() {
        this.routeStep('Set Valid Password Update Data', 'updatePasswordData', {
            oldPassword: 'StrongP@ssw0rd!',
            newPassword: 'NewStrongP@ss1',
            passwordConfirmation: 'NewStrongP@ss1',
        })
        return this
    }

    setDeleteWithNewPassword() {
        this.routeStep('Set Delete Password With New Password', 'deletePassword', 'NewStrongP@ss1')
        return this
    }

    setLoginWithWrongData() {
        const login = new LoginUserDTO()
        login.email = 'dasdasda@example.com'
        login.password = '123'

        this.routeStep('Set Login With Wrong Data', 'loginData', login)
        return this
    }

    create(status?: HttpStatus) {
        this.routeStep('Send POST to /user/create', 'create', status)
        return this
    }

    login(status?: HttpStatus) {
        this.routeStep('Send POST to /user/login', 'login', status)
        return this
    }

    me(status?: HttpStatus) {
        this.routeStep('Send GET to /user/me', 'me', status)
        return this
    }

    update(status?: HttpStatus) {
        this.routeStep('Send PATCH to /user/update', 'update', status)
        return this
    }

    updatePassword(status?: HttpStatus) {
        this.routeStep('Send PATCH to /user/updatePassword', 'updatePassword', status)
        return this
    }

    delete(status?: HttpStatus) {
        this.routeStep('Send DELETE to /user/delete', 'delete', status)
        return this
    }

    validateResponse(validateFn: (response) => void) {
        this.routeStep('Validate Response', 'validate', validateFn)
        return this
    }
}
