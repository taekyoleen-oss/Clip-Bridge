"use client";

import { useEffect, useState } from "react";
import { ClipboardManager } from "@/lib/clipboard";
import { DatabaseManager } from "@/lib/db";
import { ClipData } from "@/lib/clipboard";
import Toast from "@/components/Toast";
import ClipList from "@/components/ClipList";
import ClipboardPermission from "@/components/ClipboardPermission";
import DeviceTabs, { DeviceFilter } from "@/components/DeviceTabs";
import { getHeartbeat } from "@/lib/heartbeat";
import { detectPlatform } from "@/lib/platform";

export default function Home() {
  const [clipboardManager] = useState(() => new ClipboardManager());
  const [dbManager] = useState(() => new DatabaseManager());
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [pendingText, setPendingText] = useState("");
  const [clips, setClips] = useState<ClipData[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState<"Windows" | "Android">("Windows");
  const [activeTab, setActiveTab] = useState<DeviceFilter>("all");
  const [windowsCount, setWindowsCount] = useState(0);
  const [androidCount, setAndroidCount] = useState(0);

  useEffect(() => {
    // Supabase Heartbeat 시작 (프로젝트 일시 중지 방지)
    const heartbeat = getHeartbeat();
    heartbeat.start();

    // 플랫폼 감지
    const platform = detectPlatform();
    setCurrentPlatform(platform === "Android" ? "Android" : "Windows");

    // 클립보드 감지 이벤트 - 즉시 Toast 표시 (취소 버튼 생성)
    clipboardManager.onClipDetectedCallback((text) => {
      setPendingText(text);
      setShowToast(true);
      setCountdown(10); // 초기값 10초 설정
    });

    // 타이머 업데이트
    clipboardManager.onTimerUpdateCallback((seconds) => {
      setCountdown(seconds);
    });

    // 타이머 완료 (저장)
    clipboardManager.onTimerCompleteCallback(async () => {
      if (pendingText) {
        await dbManager.saveClip(pendingText, currentPlatform);
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

    // 통계 정보 로드
    const loadStats = async () => {
      const stats = await dbManager.getClipStats();
      setWindowsCount(stats.windowsCount);
      setAndroidCount(stats.androidCount);
    };

    loadStats();

    return () => {
      heartbeat.stop();
    };
  }, [clipboardManager, dbManager, pendingText, currentPlatform]);

  // 탭 변경 시 데이터 다시 로드
  useEffect(() => {
    // 통계 정보 로드
    const loadStats = async () => {
      const stats = await dbManager.getClipStats();
      setWindowsCount(stats.windowsCount);
      setAndroidCount(stats.androidCount);
    };

    loadStats();

    // 데이터베이스 구독 (device 필터 적용)
    const unsubscribe = dbManager.subscribeToClips((newClips) => {
      setClips(newClips);
      // 통계도 업데이트
      loadStats();
    }, activeTab);

    return () => {
      unsubscribe();
    };
  }, [activeTab, dbManager]);

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
    if (typeof window !== "undefined" && "share" in navigator) {
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

        <DeviceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          windowsCount={windowsCount}
          androidCount={androidCount}
        />

        <ClipList
          clips={clips}
          onCopy={handleCopy}
          onShare={handleShare}
          onDelete={handleDelete}
          isMobile={currentPlatform === "Android"}
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

