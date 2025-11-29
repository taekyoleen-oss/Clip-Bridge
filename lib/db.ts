import { supabase, getSupabaseClient } from "./supabase";
import { ClipData } from "./clipboard";

export class DatabaseManager {
  private userId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // 익명 인증으로 사용자 ID 생성
      this.initializeAuth();
    }
  }

  private async initializeAuth() {
    try {
      // Supabase 클라이언트 가져오기 (필요시 초기화)
      const client = getSupabaseClient();

      // 현재 세션 확인
      const { data: { session } } = await client.auth.getSession();
      
      if (session?.user) {
        this.userId = session.user.id;
        return;
      }

      // 익명 사용자로 로그인 (Supabase는 익명 인증을 지원하지 않으므로 로컬 스토리지 사용)
      // 또는 익명 사용자를 위한 커스텀 구현
      this.userId = localStorage.getItem("clipbridge_user_id") || this.generateUserId();
      localStorage.setItem("clipbridge_user_id", this.userId);

      // Supabase에서 익명 사용자를 위한 별도 처리
      // 여기서는 로컬 스토리지 기반 사용자 ID를 사용하고,
      // 실제 인증이 필요한 경우 Supabase Auth를 사용할 수 있습니다.
    } catch (error) {
      console.error("인증 실패:", error);
      // 로컬 스토리지에서 사용자 ID 가져오기 (폴백)
      this.userId = localStorage.getItem("clipbridge_user_id") || this.generateUserId();
      localStorage.setItem("clipbridge_user_id", this.userId);
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async saveClip(text: string, device: string = "Windows"): Promise<string> {
    if (!this.userId) {
      await this.initializeAuth();
    }

    // Supabase 클라이언트 가져오기 (필요시 초기화)
    const client = getSupabaseClient();

    const clipData = {
      user_id: this.userId,
      text: text,
      timestamp: new Date().toISOString(),
      device: device,
      is_synced: true,
    };

    console.log("📤 Supabase에 저장 시도:", {
      user_id: this.userId,
      device: device,
      text_length: text.length,
    });

    const { data, error } = await client
      .from("clips")
      .insert(clipData)
      .select()
      .single();

    if (error) {
      console.error("❌ 클립 저장 오류:", error);
      console.error("오류 상세:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`저장 실패: ${error.message || "알 수 없는 오류"}`);
    }

    console.log("✅ 저장 성공:", data.id);
    return data.id;
  }

  subscribeToClips(
    callback: (clips: ClipData[]) => void,
    deviceFilter?: "all" | "Windows" | "Android"
  ) {
    if (!this.userId) {
      this.initializeAuth().then(() => {
        this.subscribeToClips(callback, deviceFilter);
      });
      return () => {};
    }

    try {
      // Supabase 클라이언트 가져오기 (필요시 초기화)
      const client = getSupabaseClient();

      // 초기 데이터 로드
      this.loadClips(callback, deviceFilter);

      // 실시간 구독 설정
      const channel = client
        .channel("clips_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "clips",
            filter: `user_id=eq.${this.userId}`,
          },
          (payload) => {
            // 변경사항 발생 시 데이터 다시 로드
            this.loadClips(callback, deviceFilter);
          }
        )
        .subscribe();

      return () => {
        client?.removeChannel(channel);
      };
    } catch (error) {
      console.error("Supabase 클라이언트 초기화 실패:", error);
      return () => {};
    }
  }

  private async loadClips(
    callback: (clips: ClipData[]) => void,
    deviceFilter?: "all" | "Windows" | "Android"
  ) {
    if (!this.userId) return;

    try {
      // Supabase 클라이언트 가져오기 (필요시 초기화)
      const client = getSupabaseClient();

      let query = client
        .from("clips")
        .select("*")
        .eq("user_id", this.userId!)
        .order("timestamp", { ascending: false })
        .limit(100);

    // device 필터 적용
    if (deviceFilter && deviceFilter !== "all") {
      query = query.eq("device", deviceFilter);
    }

      const { data, error } = await query;

      if (error) {
        console.error("클립 로드 오류:", error);
        callback([]);
        return;
      }

      // ClipData 형식으로 변환
      const clips: ClipData[] = (data || []).map((clip: any) => ({
        id: clip.id,
        text: clip.text,
        timestamp: clip.timestamp,
        device: clip.device,
        isSynced: clip.is_synced,
      }));

      callback(clips);
    } catch (error) {
      console.error("클립 로드 실패:", error);
      callback([]);
    }
  }

  // 통계 정보 가져오기
  async getClipStats(): Promise<{ windowsCount: number; androidCount: number }> {
    if (!this.userId) {
      return { windowsCount: 0, androidCount: 0 };
    }

    try {
      // Supabase 클라이언트 가져오기 (필요시 초기화)
      const client = getSupabaseClient();

      const [windowsResult, androidResult] = await Promise.all([
        client
          .from("clips")
          .select("id", { count: "exact", head: true })
          .eq("user_id", this.userId!)
          .eq("device", "Windows"),
        client
          .from("clips")
          .select("id", { count: "exact", head: true })
          .eq("user_id", this.userId!)
          .eq("device", "Android"),
      ]);

      return {
        windowsCount: windowsResult.count || 0,
        androidCount: androidResult.count || 0,
      };
    } catch (error) {
      console.error("통계 정보 가져오기 실패:", error);
      return { windowsCount: 0, androidCount: 0 };
    }
  }

  async deleteClip(clipId: string): Promise<void> {
    if (!this.userId) return;

    try {
      // Supabase 클라이언트 가져오기 (필요시 초기화)
      const client = getSupabaseClient();

      const { error } = await client
        .from("clips")
        .delete()
        .eq("id", clipId)
        .eq("user_id", this.userId!);

      if (error) {
        console.error("클립 삭제 오류:", error);
        throw error;
      }
    } catch (error) {
      console.error("클립 삭제 실패:", error);
      throw error;
    }
  }

  getUserId(): string | null {
    return this.userId;
  }

  // 클립 목록 새로고침 (수동 호출용)
  async refreshClips(
    callback: (clips: ClipData[]) => void,
    deviceFilter?: "all" | "Windows" | "Android"
  ): Promise<void> {
    await this.loadClips(callback, deviceFilter);
  }
}
