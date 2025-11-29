export interface ClipData {
  id: string;
  text: string;
  timestamp: string;
  device: string;
  isSynced: boolean;
}

export class ClipboardManager {
  private lastClipboardText: string = "";
  private timerId: NodeJS.Timeout | null = null;
  private onClipDetected: ((text: string) => void) | null = null;
  private onTimerUpdate: ((seconds: number) => void) | null = null;
  private onTimerComplete: (() => void) | null = null;
  private onTimerCancel: (() => void) | null = null;
  private currentSeconds: number = 10;
  private isPaused: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.startListening();
    }
  }

  private startListening() {
    // 클립보드 변경 감지 (주기적 체크)
    setInterval(() => {
      this.checkClipboard();
    }, 500);
  }

  private async checkClipboard() {
    if (this.isPaused) return;

    // 클립보드 API 지원 확인
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      
      // 텍스트가 변경되었고, 비어있지 않은 경우
      if (text && text !== this.lastClipboardText && text.trim().length > 0) {
        this.lastClipboardText = text;
        this.handleNewClip(text);
      }
    } catch (error: any) {
      // 클립보드 읽기 권한이 없는 경우 (HTTPS 필요)
      // 권한 오류는 조용히 무시 (주기적으로 재시도)
      if (error.name !== "NotAllowedError" && error.name !== "SecurityError") {
        console.warn("클립보드 읽기 오류:", error);
      }
    }
  }

  private handleNewClip(text: string) {
    // 기존 타이머 취소
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    // 새 타이머 시작
    this.currentSeconds = 10;
    this.onClipDetected?.(text);

    this.timerId = setInterval(() => {
      this.currentSeconds--;
      this.onTimerUpdate?.(this.currentSeconds);

      if (this.currentSeconds <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }

  private completeTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.onTimerComplete?.();
    this.currentSeconds = 10;
  }

  // 즉시 저장 (타이머 스킵)
  saveImmediately() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.onTimerComplete?.();
    this.currentSeconds = 10;
  }

  // 타이머 취소
  cancelTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.onTimerCancel?.();
    this.currentSeconds = 10;
  }

  // 일시정지/재개
  setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  // 이벤트 핸들러 등록
  onClipDetectedCallback(callback: (text: string) => void) {
    this.onClipDetected = callback;
  }

  onTimerUpdateCallback(callback: (seconds: number) => void) {
    this.onTimerUpdate = callback;
  }

  onTimerCompleteCallback(callback: () => void) {
    this.onTimerComplete = callback;
  }

  onTimerCancelCallback(callback: () => void) {
    this.onTimerCancel = callback;
  }

  getCurrentSeconds(): number {
    return this.currentSeconds;
  }
}

