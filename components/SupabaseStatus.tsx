"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSupabase = async () => {
      // Next.js에서 클라이언트 사이드 환경 변수는 빌드 타임에 주입됨
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // 디버깅 정보 출력 (개발 환경에서만)
      if (process.env.NODE_ENV === "development") {
        console.log("환경 변수 확인:", {
          url: url ? `${url.substring(0, 20)}...` : "없음",
          key: key ? `${key.substring(0, 20)}...` : "없음",
        });
      }

      if (!url || !key) {
        setStatus("error");
        const missingVars = [];
        if (!url) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
        if (!key) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
        
        setErrorMessage(
          `환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}. ` +
          "Vercel 대시보드에서 환경 변수를 설정하고 재배포하세요."
        );
        return;
      }

      try {
        // getSupabaseClient를 사용하여 클라이언트 가져오기
        const client = getSupabaseClient();
        
        // 간단한 연결 테스트
        const { error } = await client
          .from("clips")
          .select("id", { count: "exact", head: true })
          .limit(1);
        
        if (error) {
          setStatus("error");
          setErrorMessage(`연결 오류: ${error.message}`);
        } else {
          setStatus("ok");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(`연결 실패: ${err.message || "알 수 없는 오류"}`);
      }
    };

    checkSupabase();
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "ok") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-green-800 text-sm font-medium">
            Supabase 연결 성공
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 mb-1">
            ⚠️ Supabase 연결 오류
          </h3>
          <p className="text-red-700 text-sm mb-2">{errorMessage}</p>
          <div className="text-red-600 text-xs space-y-1">
            <p>
              <strong>해결 방법:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Vercel 대시보드에서 환경 변수 설정</li>
              <li>Settings → Environment Variables</li>
              <li>
                <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> 추가
              </li>
              <li>
                <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 추가
              </li>
              <li>재배포 실행</li>
            </ol>
            <p className="mt-2">
              자세한 내용은 <code className="bg-red-100 px-1 rounded">VERCEL_ENV_SETUP.md</code> 파일을 참고하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


