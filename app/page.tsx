"use client";

import { useEffect, useState } from "react";
import { ClipboardManager } from "@/lib/clipboard";
import { DatabaseManager } from "@/lib/db";
import { ClipData } from "@/lib/clipboard";
import Toast from "@/components/Toast";
import ClipList from "@/components/ClipList";
import ClipboardPermission from "@/components/ClipboardPermission";
import SupabaseStatus from "@/components/SupabaseStatus";
import DeviceTabs, { DeviceFilter } from "@/components/DeviceTabs";
import ManualInput from "@/components/ManualInput";
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
  const [backgroundSaveMessage, setBackgroundSaveMessage] = useState<string | null>(null);

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
      // 0초에 도달하면 Toast를 즉시 닫기 (완료 콜백이 호출되기 전에)
      if (seconds <= 0) {
        setShowToast(false);
      }
    });

    // 타이머 완료 (저장)
    clipboardManager.onTimerCompleteCallback(async (text: string) => {
      if (text && text.trim().length > 0) {
        try {
          console.log("💾 저장 시작:", text.substring(0, 50));
          const clipId = await dbManager.saveClip(text, currentPlatform);
          console.log("✅ 저장 완료:", clipId);
        } catch (error: any) {
          console.error("❌ 저장 실패:", error);
          // 사용자에게 오류 알림
          alert(`저장에 실패했습니다: ${error.message || "알 수 없는 오류"}\n\n브라우저 콘솔(F12)에서 자세한 오류를 확인하세요.`);
        }
      }
      // Toast 닫기 (저장 성공 여부와 관계없이)
      setShowToast(false);
      setPendingText("");
      setCountdown(10);
    });

    // 타이머 취소
    clipboardManager.onTimerCancelCallback(() => {
      setShowToast(false);
      setPendingText("");
      setCountdown(10);
    });

    // 백그라운드 저장 알림
    clipboardManager.onBackgroundSaveCallback((message: string) => {
      // 백그라운드에서 저장된 클립이 있으면 알림 표시
      console.log("📋", message);
      setBackgroundSaveMessage(message);
      // 5초 후 알림 자동 제거
      setTimeout(() => {
        setBackgroundSaveMessage(null);
      }, 5000);
      // 통계 업데이트
      const updateStats = async () => {
        const stats = await dbManager.getClipStats();
        setWindowsCount(stats.windowsCount);
        setAndroidCount(stats.androidCount);
      };
      updateStats();
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

  // 페이지 visibility 변경 시 데이터 다시 로드 (모바일 대응)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 페이지가 포그라운드로 돌아올 때 데이터 다시 로드
        console.log("📱 페이지 포그라운드 복귀, 데이터 새로고침");
        
        // 통계 정보 로드
        const loadStats = async () => {
          const stats = await dbManager.getClipStats();
          setWindowsCount(stats.windowsCount);
          setAndroidCount(stats.androidCount);
        };

        // 클립 목록 새로고침
        dbManager.refreshClips((newClips) => {
          setClips(newClips);
          loadStats();
        }, activeTab);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [dbManager, activeTab]);

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

  const handleManualSave = async (text: string, device: "Windows" | "Android") => {
    try {
      console.log("💾 수동 저장 시작:", text.substring(0, 50), "Device:", device);
      const clipId = await dbManager.saveClip(text, device);
      console.log("✅ 수동 저장 완료:", clipId);
      
      // 통계 업데이트
      const stats = await dbManager.getClipStats();
      setWindowsCount(stats.windowsCount);
      setAndroidCount(stats.androidCount);
    } catch (error: any) {
      console.error("❌ 수동 저장 실패:", error);
      throw error; // 에러를 다시 throw하여 ManualInput 컴포넌트에서 처리
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

        <SupabaseStatus />
        <ClipboardPermission />

        {backgroundSaveMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between animate-fade-in">
            <span className="text-blue-800 text-sm">✅ {backgroundSaveMessage}</span>
            <button
              onClick={() => setBackgroundSaveMessage(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              닫기
            </button>
          </div>
        )}

        <ManualInput onSave={handleManualSave} currentPlatform={currentPlatform} />

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

