// api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Headers CORS para permitir localhost y otros orígenes
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // o '*'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, email, telefono, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"No Reply" <no-reply@regiogruasmty.com>`,
      to: 'contact@regiogruasmty.com',
      replyTo: email,
      subject: 'Nuevo mensaje desde el formulario de contacto',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; background-color: #fafafa;">
            <h2 style="color: #00529b; border-bottom: 2px solid #00529b; padding-bottom: 8px;">Nuevo mensaje desde formulario de contacto</h2>
            <p style="font-size: 16px; margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong>Teléfono:</strong> ${telefono}</p>
            <h3 style="color: #00529b; margin-top: 30px;">Mensaje:</h3>
            <p style="font-size: 15px; padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap;">${message}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <footer style="font-size: 12px; color: #999; text-align: center;">
                Este correo fue enviado desde el formulario de contacto de regiogruasmty.com
            </footer>
        </div>
      `,
    });

    res.status(200).json({ message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar correo.' });
  }
}

