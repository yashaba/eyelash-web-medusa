import { MedusaService } from "@medusajs/framework/utils"
import EmailSubscription from "./models/email-subscription"

class EmailSubscriptionModuleService extends MedusaService({
    EmailSubscription,
}){
    async markAsFailed(sub) {
        sub.failed = true
        const emailSubscription = await this.updateEmailSubscriptions(sub)
        console.log("🚀 ~ EmailSubscriptionModuleService ~ markAsFailed ~ emailSubscription:", emailSubscription)
    }
    
}

export default EmailSubscriptionModuleService