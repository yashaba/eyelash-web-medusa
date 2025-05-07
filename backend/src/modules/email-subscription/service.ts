import { MedusaService } from "@medusajs/framework/utils"
import EmailSubscription from "./models/email-subscription"

class EmailSubscriptionModuleService extends MedusaService({
    EmailSubscription,
}){
    async markAsFailed(id) {
        console.log("🚀 ~ EmailSubscriptionModuleService ~ markAsFailed ~ id:", id)
        const emailSubscription = await this.updateEmailSubscriptions(id, { failed: true })
        console.log("🚀 ~ EmailSubscriptionModuleService ~ markAsFailed ~ emailSubscription:", emailSubscription)
    }
    
}

export default EmailSubscriptionModuleService