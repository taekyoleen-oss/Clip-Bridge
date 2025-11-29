"use client";

import { useEffect, useState } from "react";
import { ClipboardManager } from "@/lib/clipboard";
import { DatabaseManager } from "@/lib/db";
import { ClipData } from "@/lib/clipboard";
import Toast from "@/components/Toast";
import ClipList from "@/components/ClipList";
import ClipboardPermission from "@/components/ClipboardPermission";
import { getHeartbeat } from "@/lib/heartbeat";

export default function Home() {
  const [clipboardManager] = useState(() => new ClipboardManager());
  const [dbManager] = useState(() => new DatabaseManager());
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [pendingText, setPendingText] = useState("");
  const [clips, setClips] = useState<ClipData[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Supabase Heartbeat 시작 (프로젝트 일시 중지 방지)
    const heartbeat = getHeartbeat();
    heartbeat.start();

    // 모바일 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 클립보드 감지 이벤트
    clipboardManager.onClipDetectedCallback((text) => {
      setPendingText(text);
      setShowToast(true);
      setCountdown(10);
    });

    // 타이머 업데이트
    clipboardManager.onTimerUpdateCallback((seconds) => {
      setCountdown(seconds);
    });

    // 타이머 완료 (저장)
    clipboardManager.onTimerCompleteCallback(async () => {
      if (pendingText) {
        const device = isMobile ? "Mobile" : "PC-Web";
        await dbManager.saveClip(pendingText, device);
        setShowToast(false);
        setPendingText("");
        setCountdown(10);
      }
    });

    // 타이머 취소
    clipboardManager.onTimerCancelCallback(() => {
      setShowToast(false);
      setPendingText("");
      setCountdown(10);
    });

    // 데이터베이스 구독
    const unsubscribe = dbManager.subscribeToClips((newClips) => {
      setClips(newClips);
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      unsubscribe();
      heartbeat.stop();
    };
  }, [clipboardManager, dbManager, pendingText, isMobile]);

  const handleSaveImmediately = () => {
    clipboardManager.saveImmediately();
  };

  const handleCancel = () => {
    clipboardManager.cancelTimer();
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 복사 성공 알림
      alert("복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
      alert("복사에 실패했습니다.");
    }
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: text,
        });
      } catch (error) {
        console.error("공유 실패:", error);
      }
    } else {
      // 공유 API가 없는 경우 복사로 대체
      handleCopy(text);
    }
  };

  const handleDelete = async (clipId: string) => {
    if (confirm("이 항목을 삭제하시겠습니까?")) {
      await dbManager.deleteClip(clipId);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📋 ClipBridge
          </h1>
          <p className="text-gray-600">
            PC와 모바일 간의 끊김 없는 텍스트 공유
          </p>
        </header>

        <ClipboardPermission />

        <ClipList
          clips={clips}
          onCopy={handleCopy}
          onShare={handleShare}
          onDelete={handleDelete}
          isMobile={isMobile}
        />
      </div>

      {showToast && (
        <Toast
          text={pendingText}
          countdown={countdown}
          onSaveImmediately={handleSaveImmediately}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}

