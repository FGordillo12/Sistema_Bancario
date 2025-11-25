import nodemailer from "nodemailer";

export async function enviarCodigo(destinatario, codigo) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: "Código de verificación (2FA)",
      text: `Tu código es: ${codigo}`,
    });

    console.log("Código enviado a", destinatario);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}
