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
  private onBackgroundSave: ((text: string) => void) | null = null;
  private currentSeconds: number = 10;
  private isPaused: boolean = false;
  private currentClipText: string = "";
  private isPageVisible: boolean = true;
  private checkInterval: NodeJS.Timeout | null = null;
  private backgroundSavedClips: string[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.setupVisibilityListener();
      this.startListening();
    }
  }

  private setupVisibilityListener() {
    // Page Visibility API로 페이지 가시성 감지
    document.addEventListener("visibilitychange", () => {
      const wasVisible = this.isPageVisible;
      this.isPageVisible = !document.hidden;

      // 백그라운드에서 포그라운드로 전환 시
      if (!wasVisible && this.isPageVisible) {
        this.handlePageVisible();
      }
    });

    // Window focus 이벤트로도 감지 (다른 앱에서 돌아올 때)
    window.addEventListener("focus", () => {
      if (this.isPageVisible) {
        // 약간의 지연을 두어 클립보드가 업데이트될 시간을 줌
        setTimeout(() => {
          this.checkClipboard();
        }, 200);
      }
    });

    // 초기 상태 설정
    this.isPageVisible = !document.hidden;
  }

  private handlePageVisible() {
    // 포그라운드로 전환 시 클립보드 즉시 체크
    // 다른 앱(워드 등)에서 복사한 내용을 감지하기 위해
    setTimeout(() => {
      this.checkClipboard();
    }, 100); // 약간의 지연을 두어 브라우저가 완전히 활성화된 후 체크
    
    // 백그라운드에서 저장된 클립이 있으면 알림
    if (this.backgroundSavedClips.length > 0) {
      const savedCount = this.backgroundSavedClips.length;
      this.backgroundSavedClips = [];
      console.log(`✅ 백그라운드에서 ${savedCount}개의 클립이 저장되었습니다.`);
      // 필요시 사용자에게 알림 표시
      if (this.onBackgroundSave) {
        this.onBackgroundSave(`${savedCount}개의 클립이 백그라운드에서 저장되었습니다.`);
      }
    }
  }

  private startListening() {
    // 클립보드 변경 감지 (주기적 체크) - 백그라운드에서도 계속 작동
    this.checkInterval = setInterval(() => {
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

    // 페이지가 백그라운드에 있으면 자동 저장 (Toast 없이)
    if (!this.isPageVisible) {
      console.log("📋 백그라운드에서 클립 감지, 자동 저장:", text.substring(0, 50));
      // 백그라운드에서는 즉시 저장
      this.backgroundSavedClips.push(text);
      this.onTimerComplete?.(text);
      this.currentClipText = "";
      return;
    }

    // 포그라운드에서는 기존 로직 (Toast 표시)
    // 복사 감지 즉시 Toast 표시 (취소 버튼 생성)
    this.currentSeconds = 10;
    this.onClipDetected?.(text);
    // 즉시 첫 번째 카운트다운 업데이트 (10초 표시)
    this.onTimerUpdate?.(this.currentSeconds);

    // 복사 시점부터 10초 카운트다운 시작
    this.timerId = setInterval(() => {
      // 백그라운드로 전환되면 타이머 중지하고 자동 저장
      if (!this.isPageVisible) {
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
        console.log("📋 백그라운드 전환, 자동 저장:", this.currentClipText.substring(0, 50));
        this.backgroundSavedClips.push(this.currentClipText);
        this.onTimerComplete?.(this.currentClipText);
        this.currentClipText = "";
        this.currentSeconds = 10;
        return;
      }

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

  onBackgroundSaveCallback(callback: (message: string) => void) {
    this.onBackgroundSave = callback;
  }

  getCurrentSeconds(): number {
    return this.currentSeconds;
  }

  // 정리 메서드
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

