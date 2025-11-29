import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipBridge - 클립보드 동기화",
  description: "PC와 모바일 간의 끊김 없는 텍스트 데이터 공유",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}


