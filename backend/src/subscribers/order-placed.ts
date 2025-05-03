// // src/subscribers/order-placed.ts
// import { SmtpService } from "../services/smtp-service"

// export default {
//   event: "order.placed",
//   handler: async (eventData) => {
//     const smtp = new SmtpService()

//     await smtp.sendMail({
//       to: eventData.order.email,
//       subject: "Order Confirmation",
//       html: `<h1>Thank you for your order, ${eventData.order.first_name}!</h1>`,
//     })
//   },
// }
