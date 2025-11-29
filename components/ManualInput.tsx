"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

interface ManualInputProps {
  onSave: (text: string, device: "Windows" | "Android") => Promise<void>;
  currentPlatform: "Windows" | "Android";
}

export default function ManualInput({ onSave, currentPlatform }: ManualInputProps) {
  const [inputText, setInputText] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<"Windows" | "Android">(currentPlatform);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!inputText.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(inputText.trim(), selectedDevice);
      setInputText("");
      // 성공 시 간단한 피드백 (선택사항)
      // 부모 컴포넌트에서 통계가 자동 업데이트되므로 추가 알림은 생략
    } catch (error: any) {
      alert(`저장에 실패했습니다: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter 또는 Cmd+Enter로 저장
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold text-gray-800">수동 입력</h2>
        <span className="text-xs text-gray-500">(Ctrl+Enter로 저장)</span>
      </div>
      
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setSelectedDevice("Windows")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDevice === "Windows"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          💻 Windows
        </button>
        <button
          onClick={() => setSelectedDevice("Android")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDevice === "Android"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📱 Android
        </button>
      </div>

      <div className="flex gap-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="저장할 텍스트를 입력하세요..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isSaving}
        />
        <button
          onClick={handleSave}
          disabled={isSaving || !inputText.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              저장
            </>
          )}
        </button>
      </div>
    </div>
  );
}

