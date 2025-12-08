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
    html: `<a href="${url}">Click here to reset your password</a>`,
  });
}

export async function sendTwoFactorCode(email: string, code: string) {
  console.log("--- TWO FACTOR CODE EMAIL ---");
  console.log(`To: ${email}`);
  console.log(`Code: ${code}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log("----------------------------");

  // In development, log the code to the console but still try to send
  // Remove this check temporarily to test email sending
  // if (process.env.NODE_ENV !== "production") {
  //   return;
  // }

  // In production, send via Resend
  await resend.emails.send({
    from: "noreply@carlosuehara.com.br",
    to: email,
    subject: "Seu código de verificação",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Código de Verificação</h2>
        <p>Seu código de verificação de dois fatores é:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">Este código expira em 10 minutos.</p>
        <p style="color: #666; font-size: 14px;">Se você não solicitou este código, ignore este email.</p>
      </div>
    `,
  });
}
