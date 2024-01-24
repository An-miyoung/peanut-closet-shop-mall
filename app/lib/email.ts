import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

type Profile = { name: string; email: string };

interface EmailOptions {
  profile: Profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "support@nextecom.site",
  name: "Peanut-Closet",
};

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_MAILTRANSPORT_AUTH_USER,
      pass: process.env.MAILTRAP_MAILTRANSPORT_AUTH_PASS,
    },
  });
  return transport;
};

const sendEmailVerificationLink = async (profile: Profile, linkUrl: string) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];
  await client.send({
    from: sender,
    to: recipients,
    subject: "Peanuts-Closet 이메일인증요청",
    text: `<h1 style='text-align:center'>Peanuts-Closet 회원가입을 환영합니다.</h1>
                  <h2 style='text-align:center'>
                    <a href="${linkUrl}">여기</a>를 클릭해 이메일 인증을 해주세요.
                  </h2>
              `,
    category: "Email Verification",
  });
};

const sendForgetPasswordLink = async (profile: Profile, linkUrl: string) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];
  await client.send({
    from: sender,
    to: recipients,
    subject: "Peanuts-Closet 비밀번호 재설정",
    text: `<h1 style='text-align:center'>Peanuts-Closet 비밀번호를 재설정합니다.</h1>
      <h2 style='text-align:center'>
         <a href="${linkUrl}">여기</a>를 클릭해 비밀번호를 재설정 해주세요.
      </h2>`,
    category: "Forget Password",
  });
};

const sendUpdatePasswordConfirmation = async (profile: Profile) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];
  await client.send({
    from: sender,
    to: recipients,
    subject: "Peanuts-Closet 비밀번호 재설정 확인",
    text: `<h1 style='text-align:center'>Peanuts-Closet 재설정됐습니다.</h1>
      <h2 style='text-align:center'>
         비밀번호가 성공적으로 재설정됐습니다.
         <a href="${process.env.SIGN_IN_URL}">새 비밀번호로 로그인</a>
      </h2>
   `,
    category: "Reset Password",
  });
};

export const sendEmail = async (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification": {
      return await sendEmailVerificationLink(profile, linkUrl!);
    }
    case "forget-password": {
      return await sendForgetPasswordLink(profile, linkUrl!);
    }
    case "password-changed": {
      return await sendUpdatePasswordConfirmation(profile);
    }
  }
};
