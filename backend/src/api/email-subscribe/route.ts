import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import nodemailer from "nodemailer"
import { EmailSubscription } from "../../models/email-subscription"
import validator from "validator"
import { IONOS_PASS, IONOS_USER } from "../../lib/constants"
import { EntityManager } from "@mikro-orm/core"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email } = req.body as { email: string }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" })
  }

  const em = req.scope.resolve("entityManager") as EntityManager
  const repo = em.getRepository(EmailSubscription)

  const existing = await repo.findOne({ email })

  if (existing) {
    return res.status(200).json({ message: "Already subscribed" })
  }

  const entry = repo.create({ email })
  await em.persistAndFlush(entry)

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 587,
    secure: false,
    auth: {
      user: IONOS_USER,
      pass: IONOS_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Furman Luxury" <${IONOS_USER}>`,
    to: email,
    subject: "Welcome to Furman Luxury 💎",
    html: "<p>Thanks for subscribing! We’ll keep you updated with our luxury beauty news.</p>",
  })

  return res.status(200).json({ success: true })
}
