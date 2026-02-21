import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || "noreply@localhost";
const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * 이메일 인증 링크를 전송합니다
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${appUrl}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "가계부 이메일 인증",
      html: getVerificationEmailTemplate(verificationUrl),
    });

    console.log(`✅ 인증 이메일 전송 완료: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", error);
    throw new Error("이메일 전송에 실패했습니다");
  }
}

/**
 * 비밀번호 재설정 링크를 전송합니다
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "가계부 비밀번호 재설정",
      html: getPasswordResetEmailTemplate(resetUrl),
    });

    console.log(`✅ 비밀번호 재설정 이메일 전송 완료: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", error);
    throw new Error("이메일 전송에 실패했습니다");
  }
}

/**
 * 이메일 인증 HTML 템플릿
 */
function getVerificationEmailTemplate(verificationUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>이메일 인증</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #0d1117; color: #c9d1d9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- 헤더 -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 32px; font-weight: 700; margin: 0; color: #ffffff;">💰 가계부</h1>
      <p style="font-size: 16px; color: #8b949e; margin: 8px 0 0 0;">이메일 인증</p>
    </div>

    <!-- 메인 컨텐츠 -->
    <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0; color: #ffffff;">
        안녕하세요! 👋
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #c9d1d9; margin: 0 0 24px 0;">
        가계부 회원가입을 위해 이메일 인증이 필요합니다.<br>
        아래 버튼을 클릭하여 이메일 인증을 완료해주세요.
      </p>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}"
           style="display: inline-block; padding: 14px 32px; background-color: #00d68f; color: #000000; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; transition: background-color 0.2s;">
          이메일 인증하기
        </a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #8b949e; margin: 24px 0 0 0;">
        버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:
      </p>
      <p style="font-size: 13px; color: #58a6ff; word-break: break-all; margin: 8px 0 0 0;">
        ${verificationUrl}
      </p>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; font-size: 13px; color: #8b949e;">
      <p style="margin: 0 0 8px 0;">
        이 링크는 24시간 동안 유효합니다.
      </p>
      <p style="margin: 0;">
        본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 비밀번호 재설정 HTML 템플릿
 */
function getPasswordResetEmailTemplate(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>비밀번호 재설정</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #0d1117; color: #c9d1d9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- 헤더 -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 32px; font-weight: 700; margin: 0; color: #ffffff;">💰 가계부</h1>
      <p style="font-size: 16px; color: #8b949e; margin: 8px 0 0 0;">비밀번호 재설정</p>
    </div>

    <!-- 메인 컨텐츠 -->
    <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0; color: #ffffff;">
        비밀번호를 잊으셨나요? 🔐
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #c9d1d9; margin: 0 0 24px 0;">
        비밀번호 재설정 요청을 받았습니다.<br>
        아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요.
      </p>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; padding: 14px 32px; background-color: #00d68f; color: #000000; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; transition: background-color 0.2s;">
          비밀번호 재설정하기
        </a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #8b949e; margin: 24px 0 0 0;">
        버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:
      </p>
      <p style="font-size: 13px; color: #58a6ff; word-break: break-all; margin: 8px 0 0 0;">
        ${resetUrl}
      </p>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; font-size: 13px; color: #8b949e;">
      <p style="margin: 0 0 8px 0;">
        이 링크는 24시간 동안 유효합니다.
      </p>
      <p style="margin: 0;">
        본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
