"use client";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📋</div>
      <p className="text-gray-600 text-lg mb-2">
        아직 저장된 클립이 없습니다.
      </p>
      <p className="text-gray-500 text-sm">
        PC에서 텍스트를 복사하면 여기에 표시됩니다.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
        <p className="text-blue-800 text-sm">
          💡 <strong>팁:</strong> 텍스트를 복사하면 10초 후 자동으로 저장됩니다.
          즉시 저장하려면 알림창의 "즉시 저장" 버튼을 클릭하세요.
        </p>
      </div>
    </div>
  );
}


