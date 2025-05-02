import { model } from "@medusajs/framework/utils"

export const email = model.define("email", {
  id: model.id().primaryKey(),
  email: model.text()

})