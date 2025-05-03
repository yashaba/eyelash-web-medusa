import {
    createStep,
    createWorkflow,
    StepResponse,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { EMAIL_SUBSCRIPTION_MODULE } from "../modules/email-subscription"
  import { SmtpService } from "../services/smtp-service"
  import EmailSubscriptionModuleService from "../modules/email-subscription/service"
  
  type CreateEmailSubscriptionWorkflowInput = {
    email: string
    lang?: "en" | "ru",
    ip: string
  }
  
  type SubscriptionResult = {
    id: string
    email: string
    lang: string
    failed: boolean
    ip: string
  }
  
  //
  // STEP 1: Save the subscription
  //
  const saveEmailSubscriptionStep = createStep(
    "save-email-subscription",
    async (
      { email,  lang = "en",ip }: CreateEmailSubscriptionWorkflowInput,
      { container }
    ) => {
      const emailSubscriptionService: EmailSubscriptionModuleService =
        container.resolve(EMAIL_SUBSCRIPTION_MODULE)

        const existingCount = await emailSubscriptionService.listAndCountEmailSubscriptions({ip})
        if (existingCount && existingCount.length && existingCount[1] > 2){
           throw new Error("You have already subscribed to our newsletter. Please check your email for the confirmation link.")
        } 
        
        console.log("🚀 ~ existingCount:", existingCount)
  
      const subscription = await emailSubscriptionService.createEmailSubscriptions({
        email,
        lang,
        ip
      })
  
      return new StepResponse(subscription, subscription)
    }
  )
  
  //
  // STEP 2: Send welcome email
  //
  const sendEmailStep = createStep(
    "send-welcome-email",
    async (subscription: SubscriptionResult, { container }) => {
      const smtp = new SmtpService()
  
      try {
        await smtp.sendMail({
          to: subscription.email,
          subject: "Welcome to Furman Luxury!",
          template: "welcome",
          lang: subscription.lang,

        })
  
        return new StepResponse(true)
      } catch (err) {
        // If email fails → flag in DB
        const emailSubscriptionService: EmailSubscriptionModuleService =
          container.resolve(EMAIL_SUBSCRIPTION_MODULE)
  
        await emailSubscriptionService.markAsFailed(subscription.id)
  
        return new StepResponse(false)
      }
    }
  )
  
  //
  // ✅ WORKFLOW
  //
  export const createEmailSubscriptionWorkflow = createWorkflow(
    "create-email-subscription",
    (input: CreateEmailSubscriptionWorkflowInput) => {
      const subscription = saveEmailSubscriptionStep(input)
      sendEmailStep(subscription)
  
      return new WorkflowResponse(subscription)
    }
  )
  