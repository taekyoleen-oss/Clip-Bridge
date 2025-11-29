"use client";

import { useState, useEffect } from "react";
import { Mail, Check, Users, ArrowRight } from "lucide-react";

interface EmailSyncProps {
  currentEmail: string | null;
  onEmailChange: (email: string) => void;
}

export default function EmailSync({ currentEmail, onEmailChange }: EmailSyncProps) {
  const [email, setEmail] = useState(currentEmail || "");
  const [isSyncing, setIsSyncing] = useState(false);

  // URL 파라미터에서 이메일 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailFromUrl = params.get("email");
      if (emailFromUrl && emailFromUrl !== currentEmail) {
        setEmail(emailFromUrl);
        handleSync(emailFromUrl);
      }
    }
  }, [currentEmail]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSync = async (emailToSync?: string) => {
    const emailToUse = emailToSync || email.trim();
    
    if (!emailToUse) {
      alert("이메일 주소를 입력해주세요.");
      return;
    }

    if (!validateEmail(emailToUse)) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (emailToUse.toLowerCase() === currentEmail?.toLowerCase()) {
      alert("이미 같은 이메일 주소를 사용 중입니다.");
      return;
    }

    setIsSyncing(true);
    try {
      onEmailChange(emailToUse);
      setEmail(emailToUse);
      alert("동기화가 완료되었습니다. 페이지를 새로고침합니다.");
      // URL 파라미터 제거하고 새로고침
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error("동기화 실패:", error);
      alert("동기화에 실패했습니다.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSync();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">기기 동기화</h2>
      </div>

      <div className="space-y-3">
        {currentEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                현재 동기화된 이메일:
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1 font-mono">
              {currentEmail}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              같은 이메일 주소를 사용하는 모든 기기에서 데이터가 동기화됩니다.
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {currentEmail ? "다른 이메일로 변경" : "이메일 주소 입력"}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="example@email.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isSyncing}
              />
            </div>
            <button
              onClick={() => handleSync()}
              disabled={isSyncing || !email.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  동기화 중...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  동기화
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {currentEmail 
              ? "다른 이메일 주소를 입력하면 해당 이메일의 데이터로 동기화됩니다."
              : "이메일 주소를 입력하면 같은 이메일을 사용하는 모든 기기에서 데이터가 동기화됩니다."}
          </p>
        </div>
      </div>
    </div>
  );
}

