"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Users, Key } from "lucide-react";

interface UserIdSyncProps {
  currentUserId: string | null;
  onUserIdChange: (userId: string) => void;
}

export default function UserIdSync({ currentUserId, onUserIdChange }: UserIdSyncProps) {
  const [copied, setCopied] = useState(false);
  const [inputUserId, setInputUserId] = useState("");
  const [showInput, setShowInput] = useState(false);

  // URL 파라미터에서 사용자 ID 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const userIdFromUrl = params.get("userId");
      if (userIdFromUrl && userIdFromUrl !== currentUserId) {
        setInputUserId(userIdFromUrl);
        setShowInput(true);
      }
    }
  }, [currentUserId]);

  const handleCopy = async () => {
    if (!currentUserId) return;
    
    try {
      await navigator.clipboard.writeText(currentUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("복사 실패:", error);
      alert("복사에 실패했습니다.");
    }
  };

  const handleSync = () => {
    if (!inputUserId.trim()) {
      alert("사용자 ID를 입력해주세요.");
      return;
    }
    
    if (inputUserId.trim() === currentUserId) {
      alert("이미 같은 사용자 ID를 사용 중입니다.");
      return;
    }

    if (confirm(`사용자 ID를 "${inputUserId.trim()}"로 변경하시겠습니까?\n\n다른 기기의 데이터를 동기화하려면 같은 사용자 ID를 사용해야 합니다.`)) {
      onUserIdChange(inputUserId.trim());
      localStorage.setItem("clipbridge_user_id", inputUserId.trim());
      setShowInput(false);
      setInputUserId("");
      alert("사용자 ID가 변경되었습니다. 페이지를 새로고침합니다.");
      window.location.reload();
    }
  };

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">기기 동기화</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            현재 사용자 ID
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 break-all">
              {currentUserId}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  복사
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            다른 기기에서 이 ID를 입력하면 동일한 데이터를 볼 수 있습니다.
          </p>
        </div>

        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            다른 기기의 사용자 ID 입력
          </button>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              동기화할 사용자 ID 입력
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                placeholder="다른 기기에서 복사한 사용자 ID를 입력하세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSync}
                disabled={!inputUserId.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                동기화
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setInputUserId("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
            <p className="text-xs text-gray-500">
              다른 기기에서 복사한 사용자 ID를 입력하면 같은 데이터를 볼 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

