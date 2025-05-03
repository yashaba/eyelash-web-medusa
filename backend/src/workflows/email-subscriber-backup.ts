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
  }
  
  const createPostStep = createStep(
    "create-email-subscription",
    async ({ email }: CreateEmailSubscriptionWorkflowInput, { container }) => {
      const emailSubscriptionService: EmailSubscriptionModuleService = container.resolve(EMAIL_SUBSCRIPTION_MODULE)
  
      const  emailSubscription = await emailSubscriptionService.createEmailSubscriptions({email})
  
      return new StepResponse(emailSubscription, emailSubscription)
    },
    // async (post, { container }) => {
    //   const emailSubscriptionService: BlogModuleService = container.resolve(EMAIL_SUBSCRIPTION_MODULE)
  
    //   await emailSubscriptionService.deletePosts(post.id)
    // }
  )
  
  export const createPostWorkflow = createWorkflow(
    "create-post",
    (postInput: CreateEmailSubscriptionWorkflowInput) => {
      const post = createPostStep(postInput)
  
      return new WorkflowResponse(post)
    }
  )