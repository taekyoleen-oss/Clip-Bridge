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
    <div className="bg-white rounded-lg shadow-md p-3 mb-6 border border-gray-200">
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium text-base">{tab.label}</span>
              </div>
              <span
                className={`
                  px-3 py-1 rounded-full text-sm font-semibold
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

