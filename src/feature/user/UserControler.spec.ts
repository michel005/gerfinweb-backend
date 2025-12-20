import { ErrorCode } from '@/constant/ErrorCode'
import { DSL } from '../../../test/dsl/DSL'
import { HttpStatus } from '@nestjs/common'

describe('UserControler', () => {
    let dsl: DSL
    beforeEach(async () => {
        dsl = await DSL.init()
    })

    afterEach(async () => {
        await dsl.close()
    })

    it('Should validate the create form', async () => {
        await dsl
            .user()
            .setUserWithEmptyData()
            .create(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.details).not.toBeNull()
                expect(response.body.details.fullName).toBe(ErrorCode.GENERAL_MANDATORY_FIELD)
                expect(response.body.details.email).toBe(ErrorCode.GENERAL_MANDATORY_FIELD)
                expect(response.body.details.password).toBe(ErrorCode.GENERAL_MANDATORY_FIELD)
                expect(response.body.details.passwordConfirmation).toBe(ErrorCode.GENERAL_MANDATORY_FIELD)
            })
            .build()
    })
    it('Should validate a user with a existing email', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .create(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Email já cadastrado!')
            })
            .build()
    })
    it('Should validate a weak password', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .setWeakPassword()
            .create(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.details.password).toBe('A senha não atende aos requisitos de segurança')
            })
            .build()
    })
    it('Should create a user successfully', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create(HttpStatus.CREATED)
            .validateResponse((response) => {
                expect(response.body.createdAt).toBeDefined()
            })
            .build()
    })
    it('Should login successfully', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login(HttpStatus.CREATED)
            .validateResponse((response) => {
                expect(response.body.access_token).toBeDefined()
            })
            .build()
    })
    it('Should fail to login with wrong password', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithWrongData()
            .login(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Usuário / Senha inválido!')
            })
            .build()
    })
    it('Should get logged user info', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .me(HttpStatus.OK)
            .validateResponse((response) => {
                expect(response.body.email).toBe('example@example.com')
            })
            .build()
    })
    it('Should fail to get logged user info without login access token', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .me(HttpStatus.UNAUTHORIZED)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Unauthorized')
            })
            .build()
    })
    it('Should update user info', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .setDifferentFullNameUserData()
            .update(HttpStatus.OK)
            .me(HttpStatus.OK)
            .validateResponse((response) => {
                expect(response.body.fullName).toBe('John Doe 123')
            })
            .build()
    })
    it('Should validate update user without token', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .update(HttpStatus.UNAUTHORIZED)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Unauthorized')
            })
            .build()
    })
    it('Should validate wrong password to update user password', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .setInvalidPasswordUpdateData()
            .updatePassword(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Senha antiga incorreta!')
            })
            .build()
    })
    it('Should validate wrong password confirmation to update user password', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .setInvalidPasswordConfirmationUpdateData()
            .updatePassword(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Senhas não conferem!')
            })
            .build()
    })
    it('Should change user password successfully', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .setValidPasswordUpdateData()
            .updatePassword(HttpStatus.OK)
            .validateResponse((response) => {
                expect(response.body.createdAt).toBeDefined()
            })
            .setDeleteWithNewPassword()
            .delete(HttpStatus.OK)
            .build()
    })
    it('Should validate delete user without inform password', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .delete(HttpStatus.BAD_REQUEST)
            .validateResponse((response) => {
                expect(response.body.details.password).toBe(ErrorCode.GENERAL_MANDATORY_FIELD)
            })
            .build()
    })
    it('Should delete user successfully', async () => {
        await dsl
            .user()
            .setUserWithSimpleData()
            .create()
            .setLoginWithSimpleData()
            .login()
            .setCorrectDeletePassword()
            .delete(HttpStatus.OK)
            .me(HttpStatus.UNAUTHORIZED)
            .validateResponse((response) => {
                expect(response.body.message).toBe('Unauthorized')
            })
            .build()
    })
})
