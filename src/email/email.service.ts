import {Inject, Injectable} from '@nestjs/common';
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from 'nodemailer'
import emailConfig from "src/config/emailConfig";
import {ConfigType} from "@nestjs/config";
interface IEmailOptions  {
    to : string;
    subject : string;
    html : string;
}

@Injectable()
export class EmailService {
    private transporter : Mail


    constructor(@Inject(emailConfig.KEY) private config : ConfigType<typeof emailConfig>) {
        this.transporter = nodemailer.createTransport({
            service : config.service,
            auth : {
                user : config.auth.user,
                pass : config.auth.pass
            }
        })
    }

    async sendMemberJoinVerification(emailAddress : string, signupVerifyToken:string) {
        const baseUrl = this.config.baseUrl;


        const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

        const mailOptions : IEmailOptions = {
            to : emailAddress,
            subject : '가입 인증 메일',
            html : `
                <form action="${url}" method = "POST">
                    <button>가입 확인</button>
                </form>
            `
        }

        console.log(emailAddress)

        return await this.transporter.sendMail(mailOptions)
    }
}
