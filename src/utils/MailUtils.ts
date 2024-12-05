import nodemailer from 'nodemailer'

export class MailUtils {
    static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'micheldouglasgrigoli@gmail.com',
            pass: 'xouf vhok yvxk svhm',
        },
    })

    static send = async ({
        to,
        subject,
        html,
    }: {
        to: string
        subject: string
        html: string
    }) => {
        await this.transporter.sendMail({
            from: 'micheldougasgrigoli@gmail.com',
            to,
            subject,
            html,
        })
    }
}
