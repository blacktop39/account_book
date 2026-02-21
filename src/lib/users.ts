import { hash, compare } from "bcryptjs";
import { prisma } from "./prisma";

// Edge Runtime 호환 토큰 생성
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string | null;  // OAuth 사용자는 null
  image?: string | null;
  emailVerified: boolean;
  emailVerifiedAt?: Date | null;
}

// 사용자 생성
export async function createUser(
  email: string,
  name: string,
  password: string,
  termsAgreed?: boolean,
  privacyAgreed?: boolean,
  marketingAgreed?: boolean
): Promise<{ user: User; verificationToken: string } | null> {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return null;
  }

  const hashedPassword = await hash(password, 10);
  const now = new Date();

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      termsAgreedAt: termsAgreed ? now : null,
      privacyAgreedAt: privacyAgreed ? now : null,
      marketingAgreed: marketingAgreed || false,
      marketingAgreedAt: marketingAgreed ? now : null,
      emailVerified: true, // 임시: 도메인 없어서 자동 인증 처리
      emailVerifiedAt: now,
    },
  });

  // 이메일 인증 토큰 생성
  const verificationToken = await createEmailVerificationToken(user.id);

  return { user, verificationToken };
}

// 이메일로 사용자 찾기
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

// 사용자 인증
export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    return null;  // OAuth 사용자는 비밀번호 로그인 불가
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
}

// 사용자 정보 반환 (비밀번호 제외)
export function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...sanitized } = user;
  void password;
  return sanitized;
}

// 비밀번호 재설정 토큰 생성
export async function createResetToken(email: string): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  // 기존 토큰 삭제
  await prisma.resetToken.deleteMany({
    where: { userId: user.id },
  });

  // 암호학적으로 안전한 토큰 생성 (Edge Runtime 호환)
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

  await prisma.resetToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  return token;
}

// 토큰 검증
export async function verifyResetToken(token: string): Promise<string | null> {
  const resetToken = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return null;
  }

  if (new Date() > resetToken.expiresAt) {
    // 만료된 토큰 삭제
    await prisma.resetToken.delete({
      where: { id: resetToken.id },
    });
    return null;
  }

  return resetToken.user.email;
}

// 비밀번호 재설정
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  const resetToken = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return false;
  }

  if (new Date() > resetToken.expiresAt) {
    await prisma.resetToken.delete({
      where: { id: resetToken.id },
    });
    return false;
  }

  const hashedPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // 사용된 토큰 삭제
  await prisma.resetToken.delete({
    where: { id: resetToken.id },
  });

  return true;
}

// 이메일 인증 토큰 생성
export async function createEmailVerificationToken(
  userId: string
): Promise<string> {
  // 기존 토큰 삭제
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  // 암호학적으로 안전한 토큰 생성 (Edge Runtime 호환)
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간

  await prisma.emailVerificationToken.create({
    data: {
      token,
      expiresAt,
      userId,
    },
  });

  return token;
}

// 이메일 인증 토큰 검증 및 이메일 인증 완료
export async function verifyEmailToken(token: string): Promise<boolean> {
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) {
    return false;
  }

  if (new Date() > verificationToken.expiresAt) {
    // 만료된 토큰 삭제
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
    return false;
  }

  // 이메일 인증 완료
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // 사용된 토큰 삭제
  await prisma.emailVerificationToken.delete({
    where: { id: verificationToken.id },
  });

  return true;
}

// 이메일 인증 재발송
export async function resendVerificationEmail(
  email: string
): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  // 이미 인증된 사용자
  if (user.emailVerified) {
    return null;
  }

  // 새 토큰 생성
  const token = await createEmailVerificationToken(user.id);
  return token;
}
