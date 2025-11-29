import { supabase } from "./supabase";

/**
 * Supabase 프로젝트가 일시 중지되지 않도록 주기적으로 활동을 유지하는 Heartbeat 클래스
 * 무료 플랜의 경우 7일간 비활성 상태가 지속되면 프로젝트가 자동으로 일시 중지됩니다.
 */
export class SupabaseHeartbeat {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly INTERVAL_MS = 5 * 60 * 1000; // 5분마다 실행
  private isActive = false;

  /**
   * Heartbeat 시작
   * 페이지가 활성 상태일 때 주기적으로 Supabase에 요청을 보냅니다.
   */
  start() {
    if (this.isActive || typeof window === "undefined") return;

    this.isActive = true;
    
    // 즉시 한 번 실행
    this.ping();

    // 주기적으로 실행
    this.intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        this.ping();
      }
    }, this.INTERVAL_MS);

    // 페이지 가시성 변경 감지
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * Heartbeat 중지
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * Supabase에 간단한 요청을 보내어 활동 상태 유지
   */
  private async ping() {
    if (!supabase) return;

    try {
      // 가장 가벼운 쿼리: clips 테이블의 개수 조회 (LIMIT 1로 최소화)
      const { error } = await supabase
        .from("clips")
        .select("id", { count: "exact", head: true })
        .limit(1);

      if (error) {
        console.warn("Heartbeat ping 실패:", error.message);
      } else {
        console.log("Heartbeat: Supabase 연결 유지됨");
      }
    } catch (error) {
      console.warn("Heartbeat ping 오류:", error);
    }
  }

  /**
   * 페이지 가시성 변경 핸들러
   * 페이지가 보일 때만 heartbeat를 실행합니다.
   */
  private handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && this.isActive) {
      // 페이지가 다시 보이면 즉시 ping
      this.ping();
    }
  };
}

// 싱글톤 인스턴스
let heartbeatInstance: SupabaseHeartbeat | null = null;

export function getHeartbeat(): SupabaseHeartbeat {
  if (!heartbeatInstance) {
    heartbeatInstance = new SupabaseHeartbeat();
  }
  return heartbeatInstance;
}

