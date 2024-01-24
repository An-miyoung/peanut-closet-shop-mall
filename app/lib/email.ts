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
    template_uuid: "51c0599e-4632-4fff-b8e3-dae8cfc74ac3",
    template_variables: {
      subject: "Peanuts-Closet 이메일인증요청",
      user_name: profile.name,
      link: linkUrl,
      btn_title: "이메일 인증",
    },
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
    template_uuid: "51c0599e-4632-4fff-b8e3-dae8cfc74ac3",
    template_variables: {
      subject: "Peanuts-Closet 비밀번호 재설정요청",
      user_name: profile.name,
      link: linkUrl,
      btn_name: "비밀번호 재설정",
    },
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
    template_uuid: "51c0599e-4632-4fff-b8e3-dae8cfc74ac3",
    template_variables: {
      subject: "Peanuts-Closet 비밀번호 재설정 확인",
      user_name: profile.name,
      link: process.env.SIGN_IN_URL!,
      btn_title: "새 비밀번호로 로그인",
    },
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
