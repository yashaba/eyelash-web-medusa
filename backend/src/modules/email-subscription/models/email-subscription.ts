import { model } from "@medusajs/framework/utils"

const EmailSubscription = model.define("email-subscription", {
  id: model.id().primaryKey(),
  email: model.text().unique(),
  lang: model.text(),
  ip: model.text(),
  failed: model.boolean().default(false),
})
export default EmailSubscription
