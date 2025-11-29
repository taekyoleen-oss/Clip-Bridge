import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  // 클라이언트 사이드에서만 실행
  if (typeof window === "undefined") {
    throw new Error("Supabase 클라이언트는 클라이언트 사이드에서만 사용할 수 있습니다.");
  }

  // 이미 초기화된 클라이언트가 있으면 반환
  if (supabase) {
    return supabase;
  }

  // 환경 변수 확인 (클라이언트 사이드에서 직접 읽기)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("⚠️ Supabase 환경 변수가 설정되지 않았습니다!");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "설정됨" : "없음");
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "설정됨" : "없음");
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.");
  }

  // 클라이언트 생성
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  console.log("✅ Supabase 클라이언트 초기화 완료");
  return supabase;
}

// 클라이언트 사이드에서 자동으로 초기화
if (typeof window !== "undefined") {
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    console.error("Supabase 초기화 실패:", error);
  }
}

export { supabase, getSupabaseClient };
export default supabase;

