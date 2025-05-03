import EmailSubscriptionModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const EMAIL_SUBSCRIPTION_MODULE = "emailSubscriptionModule"

export default Module(EMAIL_SUBSCRIPTION_MODULE, {
  service: EmailSubscriptionModuleService,
})