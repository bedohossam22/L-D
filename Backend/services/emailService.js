import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
 const verifyUrl = `http://localhost:4000/api/auth/verify/${token}`;

  const mailOptions = {
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};
