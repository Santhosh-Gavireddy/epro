import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Check if SMTP vars are present
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL) {
    console.log('Skipping email send (no SMTP config). Message:', options.message);
    return;
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
