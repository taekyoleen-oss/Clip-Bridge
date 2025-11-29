"use client";

import { X, Save, Clock } from "lucide-react";

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
  const previewText = text.length > 50 ? `${text.substring(0, 50)}...` : text;

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl p-6 max-w-md w-full z-50 animate-slide-up border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">저장 대기 중</h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">내용:</p>
        <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 break-words">
          {previewText}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">{countdown}</span>
          </div>
          <span className="text-sm text-gray-600">초 후 자동 저장</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSaveImmediately}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          즉시 저장
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}

