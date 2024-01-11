import nodemailer from "nodemailer";

type Profile = { name: string; email: string };

interface EmailOptions {
  profile: Profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generateMailTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_MAILTRANSPORT_AUTH_USER,
    pass: process.env.MAILTRAP_MAILTRANSPORT_AUTH_PASS,
  },
});

const sendEmailVerification = async (profile: Profile, linkUrl: string) => {
  await generateMailTransporter.sendMail({
    from: "support@next-shop.com",
    to: profile.email,
    html: `<h1 style='text-align:center'>Peanuts-Closet 회원가입을 환영합니다.</h1>
             <h2 style='text-align:center'>
               <a href="${linkUrl}">여기</a>를 클릭해 이메일 인증을 해주세요.
             </h2>
         `,
  });
};

const forgetPassword = async (profile: Profile, linkUrl: string) => {
  await generateMailTransporter.sendMail({
    from: "support@next-shop.com",
    to: profile.email,
    html: `<h1 style='text-align:center'>Peanuts-Closet 비밀번호를 재설정합니다.</h1>
            <h2 style='text-align:center'>
               <a href="${linkUrl}">여기</a>를 클릭해 비밀번호를 재설정 해주세요.
            </h2>
`,
  });
};

const passwordChange = async (profile: Profile) => {
  await generateMailTransporter.sendMail({
    from: "support@next-shop.com",
    to: profile.email,
    html: `<h1 style='text-align:center'>Peanuts-Closet 재설정됐습니다.</h1>
             <h2 style='text-align:center'>
                비밀번호가 성공적으로 재설정됐습니다.
                <a href="${process.env.SIGN_IN_URL}">새 비밀번호로 로그인</a>
             </h2>
          `,
  });
};

export const sendEmail = async (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification": {
      return await sendEmailVerification(profile, linkUrl!);
    }
    case "forget-password": {
      return await forgetPassword(profile, linkUrl!);
    }
    case "password-changed": {
      return await passwordChange(profile);
    }
  }
};
