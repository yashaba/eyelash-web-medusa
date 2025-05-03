import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { 
    createEmailSubscriptionWorkflow,
  } from "../../workflows/email-subscriber"
  
  export async function POST(
    req: MedusaRequest, 
    res: MedusaResponse
  ) {
    const { email, lang } = req.body as {
        email: string
        lang: 'en' | 'ru'
      }
      const ip =
  req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
  req.socket?.remoteAddress ||
  "unknown"

    const { result: post } = await createEmailSubscriptionWorkflow(req.scope)
      .run({
        input: {
          email: email,
          lang: lang || "en",
          ip
        },
      })
  
    res.json({
      post,
    })
  }