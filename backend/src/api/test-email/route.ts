import { SmtpService } from "../../services/smtp-service"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const to = req.query.to as string
  const name = req.query.name as string || "Customer"
  const template = req.query.template as string || "welcome"
  const lang = req.query.lang as string || "en"

 

  const smtp = new SmtpService()

  try {
    await smtp.sendMail({
      to,
      subject: "Welcome to Furman Luxury 💎",
      template,
      lang,
      params: { name },
    })

    res.status(200).json({ success: true, message: "Email sent" })
  } catch (err) {
    console.error("Email failed", err)
    res.status(500).json({ success: false, error: err.message })
  }
}
