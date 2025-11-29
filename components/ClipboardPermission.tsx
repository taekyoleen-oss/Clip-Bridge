"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function ClipboardPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (typeof window === "undefined") return;

    try {
      // Clipboard API 권한 확인
      const permissionStatus = await navigator.permissions.query({
        name: "clipboard-read" as PermissionName,
      });

      setHasPermission(permissionStatus.state === "granted");
      setIsChecking(false);

      // 권한 상태 변경 감지
      permissionStatus.onchange = () => {
        setHasPermission(permissionStatus.state === "granted");
      };
    } catch (error) {
      // 권한 API가 지원되지 않는 경우 (일부 브라우저)
      // 클립보드 읽기 시도로 확인
      try {
        await navigator.clipboard.readText();
        setHasPermission(true);
      } catch (e) {
        setHasPermission(false);
      }
      setIsChecking(false);
    }
  };

  const requestPermission = async () => {
    try {
      // 사용자 제스처로 클립보드 읽기 시도
      await navigator.clipboard.readText();
      setHasPermission(true);
    } catch (error) {
      alert(
        "클립보드 읽기 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요."
      );
    }
  };

  if (isChecking) {
    return null;
  }

  if (hasPermission) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="text-green-800 text-sm">
          클립보드 읽기 권한이 허용되었습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 mb-1">
            클립보드 읽기 권한 필요
          </h3>
          <p className="text-yellow-700 text-sm mb-3">
            클립보드를 자동으로 감지하려면 권한이 필요합니다. 아래 버튼을 클릭하여 권한을 요청하세요.
          </p>
          <button
            onClick={requestPermission}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            권한 요청
          </button>
        </div>
      </div>
    </div>
  );
}


