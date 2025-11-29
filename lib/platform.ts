/**
 * 플랫폼 감지 유틸리티
 * Windows와 Android를 정확하게 구분합니다.
 */

export type Platform = "Windows" | "Android" | "Unknown";

/**
 * 현재 플랫폼을 감지합니다.
 * @returns "Windows", "Android", 또는 "Unknown"
 */
export function detectPlatform(): Platform {
  if (typeof window === "undefined") {
    return "Unknown";
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Android 감지
  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // Windows 감지
  if (/win/i.test(userAgent) || /windows/i.test(userAgent)) {
    return "Windows";
  }

  // macOS, Linux 등은 기본적으로 Windows로 분류 (PC로 간주)
  // 또는 Unknown으로 처리할 수도 있음
  // 여기서는 PC 계열을 Windows로 통합
  if (/mac/i.test(userAgent) || /linux/i.test(userAgent)) {
    return "Windows"; // PC 계열을 Windows로 통합
  }

  return "Unknown";
}

/**
 * 플랫폼이 모바일인지 확인합니다.
 */
export function isMobilePlatform(): boolean {
  return detectPlatform() === "Android";
}

/**
 * 플랫폼이 Windows인지 확인합니다.
 */
export function isWindowsPlatform(): boolean {
  return detectPlatform() === "Windows";
}


