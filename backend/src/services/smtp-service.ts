import nodemailer from "nodemailer"
import mjml2html from "mjml"
import fs from "fs"
import path from "path"

export class SmtpService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async sendMail({ to, subject, template, lang = "en", params = {} }) {
    const templatePath = path.resolve(`src/templates/${lang}/${template}.mjml`)
    if (!fs.existsSync(templatePath)) throw new Error("Template not found")

    let mjmlContent = fs.readFileSync(templatePath, "utf8")
    Object.keys(params).forEach((key) => {
      mjmlContent = mjmlContent.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), params[key])
    })

    const { html, errors } = mjml2html(mjmlContent)
    if (errors.length) throw new Error("MJML compilation failed")

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
  }
}
