




import rateLimit from "express-rate-limit"
import {
    defineMiddlewares,
    MedusaNextFunction,
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
})


export default defineMiddlewares({
    routes: [
        {
            matcher: "/email-subscribe",
            middlewares: [
                (
                    req: MedusaRequest,
                    res: MedusaResponse,

                    next: MedusaNextFunction
                ) => {
                    limiter(req as any, res as any, next)

                },
            ],
        },
    ],
})