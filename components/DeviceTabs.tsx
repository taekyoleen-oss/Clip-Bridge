"use client";

import { Monitor, Smartphone } from "lucide-react";

export type DeviceFilter = "all" | "Windows" | "Android";

interface DeviceTabsProps {
  activeTab: DeviceFilter;
  onTabChange: (tab: DeviceFilter) => void;
  windowsCount: number;
  androidCount: number;
}

export default function DeviceTabs({
  activeTab,
  onTabChange,
  windowsCount,
  androidCount,
}: DeviceTabsProps) {
  const tabs = [
    { id: "all" as DeviceFilter, label: "전체", count: windowsCount + androidCount },
    { id: "Windows" as DeviceFilter, label: "Windows", count: windowsCount, icon: Monitor },
    { id: "Android" as DeviceFilter, label: "Android", count: androidCount, icon: Smartphone },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-6 border border-gray-200">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="font-medium">{tab.label}</span>
              <span
                className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

