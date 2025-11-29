"use client";

import { useState, useEffect } from "react";
import { ClipData } from "@/lib/clipboard";
import { Copy, Share2, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import EmptyState from "./EmptyState";

interface ClipListProps {
  clips: ClipData[];
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
  onDelete: (clipId: string) => void;
  isMobile: boolean;
}

export default function ClipList({
  clips,
  onCopy,
  onShare,
  onDelete,
  isMobile,
}: ClipListProps) {
  const [hasShareAPI, setHasShareAPI] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 navigator.share 체크
    if (typeof window !== "undefined" && "share" in navigator) {
      setHasShareAPI(true);
    }
  }, []);

  if (clips.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {clips.map((clip) => (
        <div
          key={clip.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onCopy(clip.text)}
            >
              <p className="text-gray-800 break-words mb-2">{clip.text}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(clip.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {clip.device}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onCopy(clip.text)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="복사"
              >
                <Copy className="w-5 h-5" />
              </button>
              {hasShareAPI && (
                <button
                  onClick={() => onShare(clip.text)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="공유"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onDelete(clip.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

