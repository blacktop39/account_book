import { NextResponse } from "next/server";

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";

interface ApiError {
  code: ErrorCode;
  message: string;
  field?: string;
}

export function errorResponse(
  code: ErrorCode,
  message: string,
  field?: string
) {
  const statusMap: Record<ErrorCode, number> = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
  };

  const error: ApiError = { code, message };
  if (field) {
    error.field = field;
  }

  return NextResponse.json({ error }, { status: statusMap[code] });
}

// 편의 함수
export const unauthorized = (message = "인증이 필요합니다") =>
  errorResponse("UNAUTHORIZED", message);

export const forbidden = (message = "권한이 없습니다") =>
  errorResponse("FORBIDDEN", message);

export const notFound = (resource = "리소스") =>
  errorResponse("NOT_FOUND", `${resource}를 찾을 수 없습니다`);

export const validationError = (message: string, field?: string) =>
  errorResponse("VALIDATION_ERROR", message, field);

export const conflict = (message: string) =>
  errorResponse("CONFLICT", message);

export const internalError = (message = "서버 오류가 발생했습니다") =>
  errorResponse("INTERNAL_ERROR", message);
