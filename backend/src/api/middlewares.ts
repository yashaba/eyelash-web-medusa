import type {
    MiddlewaresConfig,
    MedusaRequest,
    MedusaResponse,
    MedusaNextFunction,
  } from "@medusajs/framework"
  import rateLimit from "express-rate-limit"
  
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
  })
  
  export const config: MiddlewaresConfig = {
    routes: [
      {
        matcher: "/email-subscribe",
        middlewares: [limiter],
      },
    ],
  }
  