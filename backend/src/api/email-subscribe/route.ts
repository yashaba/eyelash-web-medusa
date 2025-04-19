import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import nodemailer from "nodemailer"
import { EmailSubscription } from "../../models/email-subscription"
import validator from "validator"
import rateLimit from "express-rate-limit"
import { IONOS_PASS, IONOS_USER } from "../../lib/constants"

// ✅ Setup rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
})

// ✅ Actual route handler
const handler = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email } = req.body as { email: string }
  console.log("🚀 ~ handler ~ email:", email)

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" })
  }
  const manager = req.scope.resolve("manager") as any
  const repo = manager.getRepository(EmailSubscription)
  const existing = await repo.findOne({ where: { email } })

  console.log("🚀 ~ handler ~ existing:", existing)
  if (existing) {
    return res.status(200).json({ message: "Already subscribed" })
  }

  const entry = repo.create({ email })
  await repo.save(entry)

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 587,
    secure: false,
    auth: {
      user: IONOS_USER,
      pass: IONOS_PASS,
    },
  })
      console.log("🚀 ~ handler ~ IONOS_PASS:", IONOS_PASS)
  console.log("🚀 ~ handler ~ IONOS_USER:", IONOS_USER)

  await transporter.sendMail({
    from: `"Furman Luxury" <${IONOS_USER}>`,
    to: email,
    subject: "Welcome to Furman Luxury 💎",
    html: "<p>Thanks for subscribing! We’ll keep you updated with our luxury beauty news.</p>",
  })

  return res.status(200).json({ success: true })
}

// ✅ Export as array: middleware + handler
export const POST = [limiter, handler]
