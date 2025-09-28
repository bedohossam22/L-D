import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email",
    html: `<p>Please click the link below to verify your email:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
  };

  return transporter.sendMail(mailOptions);
};
