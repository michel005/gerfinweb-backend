import { Database } from '../database/Database'
import { MailUtils } from '../utils/MailUtils'
import ProjectInfo from '../../project.json'
import { ErrorCollection } from '../types/ErrorCollection'
import { Business } from './Business'
import { randomUUID } from 'node:crypto'

export class UserRecoveryBusiness {
    private client = Database.prismaClient

    public send = async ({ email }: { email?: string }) => {
        const recoveryCode = String(Math.floor(Math.random() * 1000000))

        const emailUser = await Business.user.findByEmail({ email })

        if (!emailUser) {
            ErrorCollection.simple('error', 'USER-011')
            return
        }

        const exists = await this.client.user_recovery.findFirst({
            where: {
                user: {
                    email,
                },
                status: 'EMAIL_SENT',
            },
        })

        if (exists) {
            ErrorCollection.simple('error', 'USER-014')
        }

        const recoveryInfo = await this.client.user_recovery.create({
            data: {
                id: randomUUID(),
                user_id: emailUser.id,
                recovery_code: recoveryCode,
                status: 'CREATED',
            },
        })

        await MailUtils.send({
            to: email || '',
            subject: `${ProjectInfo.short_name} - Recuperação de Acesso`,
            html: `Código para recuperação de acesso: <b>${recoveryCode}</b>`,
        })
        await this.client.user_recovery.update({
            data: {
                status: 'EMAIL_SENT',
            },
            where: {
                id: recoveryInfo.id,
            },
        })
    }

    public code = async ({
        email,
        code,
    }: {
        email?: string
        code?: string
    }) => {
        if (!code) {
            ErrorCollection.simple('code', 'USER-012')
        }

        const emailUser = await Business.user.findByEmail({ email })

        if (!emailUser) {
            ErrorCollection.simple('email', 'USER-011')
            return
        }

        const recoveryInfo = await this.client.user_recovery.findFirst({
            where: {
                recovery_code: code,
                user_id: emailUser.id,
            },
        })

        if (
            recoveryInfo &&
            emailUser?.id === recoveryInfo.user_id &&
            recoveryInfo.status !== 'DONE'
        ) {
            await this.client.user_recovery.update({
                data: {
                    status: 'VALIDATED',
                },
                where: {
                    id: recoveryInfo.id,
                },
            })
        } else {
            ErrorCollection.simple('email', 'USER-012')
        }
    }

    public changePassword = async ({
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

        const emailUser = await Business.user.findByEmail({ email })

        if (!emailUser) {
            ErrorCollection.simple('email', 'USER-011')
            return
        }

        const recoveryInfo = await this.client.user_recovery.findFirst({
            where: {
                recovery_code: code,
                user_id: emailUser.id,
            },
        })

        if (
            recoveryInfo &&
            emailUser?.id === recoveryInfo.user_id &&
            recoveryInfo.status === 'VALIDATED'
        ) {
            if (password !== confirmation) {
                ErrorCollection.simple('password', 'USER-013')
            }
            await this.client.user_recovery.update({
                data: {
                    status: 'DONE',
                },
                where: {
                    id: recoveryInfo.id,
                },
            })

            await Business.user.updatePassword({
                currentUser: emailUser,
                current: emailUser?.password,
                new_password: password,
                confirmation,
            })
        } else {
            ErrorCollection.simple('code', 'USER-012')
        }
    }
}
