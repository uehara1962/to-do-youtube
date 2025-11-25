import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email: string, url: string) {
  // In development, log the URL to the console
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("--- RESET PASSWORD EMAIL ---");
  //   console.log(`To: ${email}`);
  //   console.log(`Link: ${url}`);
  //   console.log("----------------------------");
  //   return;
  // }

  // In production, verify you have an email provider configured
  // Example with Resend:
  await resend.emails.send({
    from: "noreply@carlosuehara.com.br",
    to: email,
    subject: "Reset your password",
    html: `<a href="${url}">Click here to reset your password</a>`
  });
}