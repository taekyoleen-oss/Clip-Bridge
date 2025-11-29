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
  private onTimerComplete: ((text: string) => void) | null = null;
  private onTimerCancel: (() => void) | null = null;
  private currentSeconds: number = 10;
  private isPaused: boolean = false;
  private currentClipText: string = "";

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

    // 현재 클립 텍스트 저장
    this.currentClipText = text;

    // 복사 감지 즉시 Toast 표시 (취소 버튼 생성)
    this.currentSeconds = 10;
    this.onClipDetected?.(text);
    // 즉시 첫 번째 카운트다운 업데이트 (10초 표시)
    this.onTimerUpdate?.(this.currentSeconds);

    // 복사 시점부터 10초 카운트다운 시작
    this.timerId = setInterval(() => {
      this.currentSeconds--;
      
      if (this.currentSeconds <= 0) {
        // 0초에 도달하면 마지막 업데이트 후 완료
        this.onTimerUpdate?.(0);
        this.completeTimer();
      } else {
        this.onTimerUpdate?.(this.currentSeconds);
      }
    }, 1000);
  }

  private completeTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    // 저장할 텍스트를 콜백에 전달
    const textToSave = this.currentClipText;
    this.onTimerComplete?.(textToSave);
    this.currentSeconds = 10;
    this.currentClipText = "";
  }

  // 즉시 저장 (타이머 스킵)
  saveImmediately() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    const textToSave = this.currentClipText;
    this.onTimerComplete?.(textToSave);
    this.currentSeconds = 10;
    this.currentClipText = "";
  }

  // 타이머 취소
  cancelTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.onTimerCancel?.();
    this.currentSeconds = 10;
    this.currentClipText = "";
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

  onTimerCompleteCallback(callback: (text: string) => void) {
    this.onTimerComplete = callback;
  }

  onTimerCancelCallback(callback: () => void) {
    this.onTimerCancel = callback;
  }

  getCurrentSeconds(): number {
    return this.currentSeconds;
  }
}

