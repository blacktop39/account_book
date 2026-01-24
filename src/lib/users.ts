import { hash, compare } from "bcryptjs";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  image?: string;
}

// 메모리 기반 사용자 저장소 (데모용)
// 서버 재시작 시 초기화됨
const users: User[] = [];

// ID 생성
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 사용자 생성
export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<User | null> {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return null;
  }

  const hashedPassword = await hash(password, 10);
  const user: User = {
    id: generateId(),
    email,
    name,
    password: hashedPassword,
  };

  users.push(user);
  return user;
}

// 이메일로 사용자 찾기
export async function findUserByEmail(email: string): Promise<User | null> {
  return users.find((u) => u.email === email) || null;
}

// 사용자 인증
export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
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

// 비밀번호 재설정 토큰 저장소
interface ResetToken {
  email: string;
  token: string;
  expiresAt: Date;
}

const resetTokens: ResetToken[] = [];

// 비밀번호 재설정 토큰 생성
export function createResetToken(email: string): string {
  // 기존 토큰 삭제
  const existingIndex = resetTokens.findIndex((t) => t.email === email);
  if (existingIndex !== -1) {
    resetTokens.splice(existingIndex, 1);
  }

  const token = generateId() + generateId();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

  resetTokens.push({ email, token, expiresAt });
  return token;
}

// 토큰 검증
export function verifyResetToken(token: string): string | null {
  const resetToken = resetTokens.find((t) => t.token === token);
  if (!resetToken) {
    return null;
  }

  if (new Date() > resetToken.expiresAt) {
    // 만료된 토큰 삭제
    const index = resetTokens.indexOf(resetToken);
    resetTokens.splice(index, 1);
    return null;
  }

  return resetToken.email;
}

// 비밀번호 재설정
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  const email = verifyResetToken(token);
  if (!email) {
    return false;
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return false;
  }

  user.password = await hash(newPassword, 10);

  // 사용된 토큰 삭제
  const tokenIndex = resetTokens.findIndex((t) => t.token === token);
  if (tokenIndex !== -1) {
    resetTokens.splice(tokenIndex, 1);
  }

  return true;
}
