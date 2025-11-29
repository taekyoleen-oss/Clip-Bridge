import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: SupabaseClient | null = null;

if (typeof window !== "undefined") {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("⚠️ Supabase 환경 변수가 설정되지 않았습니다!");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "설정됨" : "없음");
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "설정됨" : "없음");
  } else if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log("✅ Supabase 클라이언트 초기화 완료");
  }
}

export { supabase };
export default supabase;

