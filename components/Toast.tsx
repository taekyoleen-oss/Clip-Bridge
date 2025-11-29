"use client";

import { X, Clock } from "lucide-react";
import { useState } from "react";

interface ToastProps {
  text: string;
  countdown: number;
  onSaveImmediately: () => void;
  onCancel: () => void;
}

export default function Toast({
  text,
  countdown,
  onSaveImmediately,
  onCancel,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);
  const previewText = text.length > 30 ? `${text.substring(0, 30)}...` : text;

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 300); // 애니메이션 시간과 맞춤
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2.5 z-50 
        border border-gray-200 flex items-center gap-3 min-w-[280px] max-w-[400px]
        ${isClosing ? "animate-slide-down" : "animate-slide-up"}
      `}
    >
      {/* 카운트다운 표시 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-600 min-w-[2rem]">
          {countdown}초
        </span>
      </div>

      {/* 텍스트 미리보기 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate" title={text}>
          {previewText}
        </p>
      </div>

      {/* 취소 버튼 */}
      <button
        onClick={handleCancel}
        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        title="취소"
        aria-label="취소"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
