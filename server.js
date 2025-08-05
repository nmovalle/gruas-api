require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configura el transporte SMTP (Hostinger)
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Ruta POST para recibir mensajes del formulario
app.post('/api/contact', async (req, res) => {
  const { name, email, telefono, message } = req.body;

  try {
    await transporter.sendMail({
        from: `"No Reply" <no-reply@regiogruasmty.com>`, // usa siempre tu cuenta SMTP aquí
        to: 'contact@regiogruasmty.com',
        replyTo: email, // el email que puso el usuario, para que puedas responderle
        subject: 'Nuevo mensaje desde el formulario de contacto',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; background-color: #fafafa;">
                <h2 style="color: #00529b; border-bottom: 2px solid #00529b; padding-bottom: 8px;">Nuevo mensaje desde formulario de contacto</h2>
                
                <p style="font-size: 16px; margin: 10px 0;"><strong>Nombre:</strong> <span style="color: #000;">${name}</span></p>
                <p style="font-size: 16px; margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a></p>
                <p style="font-size: 16px; margin: 10px 0;"><strong>Teléfono:</strong> <span style="color: #000;">${telefono}</span></p>
                
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
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
