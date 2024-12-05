import { Database } from '../database/Database'
import { UserRecoveryType } from '../types/UserRecoveryType'
import { MailUtils } from '../utils/MailUtils'
import ProjectInfo from '../../project.json'
import { UserBusiness } from './UserBusiness'
import { ErrorCollection } from '../types/ErrorCollection'
import { Business } from './Business'

export class UserRecoveryBusiness {
    private database = new Database<UserRecoveryType>('user_recovery')

    public send = ({ email }: { email?: string }) => {
        const recoveryCode = String(Math.floor(Math.random() * 1000000))

        const emailUser = Business.user.database.find(
            (x) => x.email === email
        )?.[0]

        if (!emailUser) {
            ErrorCollection.simple('error', 'USER-011')
        }

        const existis = this.database.find(
            (x) => x.user_id === emailUser.id && x.status === 'EMAIL_SENT'
        )

        if (existis.length > 0) {
            ErrorCollection.simple('error', 'USER-014')
        }

        const recoveryInfo = this.database.save({
            user_id: emailUser?.id,
            recovery_code: recoveryCode,
            status: 'CREATED',
        })

        MailUtils.send({
            to: email || '',
            subject: `${ProjectInfo.short_name} - Recuperação de Acesso`,
            html: `Código para recuperação de acesso: <b>${recoveryCode}</b>`,
        }).then(() => {
            recoveryInfo.status = 'EMAIL_SENT'
            this.database.save(recoveryInfo)
        })
    }

    public code = ({ email, code }: { email?: string; code?: string }) => {
        if (!code) {
            ErrorCollection.simple('code', 'USER-012')
        }

        const emailUser = Business.user.database.find(
            (x) => x.email === email
        )?.[0]

        if (!emailUser) {
            ErrorCollection.simple('email', 'USER-011')
        }

        const recoveryInfo = this.database.find(
            (x) => x.recovery_code === code
        )?.[0]

        if (
            recoveryInfo &&
            emailUser?.id === recoveryInfo.user_id &&
            recoveryInfo.status !== 'DONE'
        ) {
            this.database.save({
                ...recoveryInfo,
                status: 'VALIDATED',
            })
        } else {
            ErrorCollection.simple('email', 'USER-012')
        }
    }

    public changePassword = ({
        email,
        code,
        password,
        confirmation,
    }: {
        email?: string
        code?: string
        password?: string
        confirmation?: string
    }) => {
        if (!code) {
            ErrorCollection.simple('code', 'USER-012')
        }

        const emailUser = Business.user.database.find(
            (x) => x.email === email
        )?.[0]

        if (!emailUser) {
            ErrorCollection.simple('email', 'USER-011')
        }

        const recoveryInfo = this.database.find(
            (x) => x.recovery_code === code
        )?.[0]

        if (
            recoveryInfo &&
            emailUser?.id === recoveryInfo.user_id &&
            recoveryInfo.status === 'VALIDATED'
        ) {
            if (password !== confirmation) {
                ErrorCollection.simple('password', 'USER-013')
            }
            this.database.save({
                ...recoveryInfo,
                status: 'DONE',
            })

            Business.user.updatePassword({
                currentUser: emailUser,
                current: emailUser?.password,
                new_password: password,
                confirmation,
            })
        } else {
            ErrorCollection.simple('code', 'USER-012')
        }
    }

    public removeByUserId = ({ userId }: { userId?: string }) => {
        this.database
            .find((x) => x.user_id === userId)
            .forEach((x) => {
                this.database.remove(x.id)
            })
    }
}
