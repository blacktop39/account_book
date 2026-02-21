"use client";

import { useEffect } from "react";

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  fullWidth?: boolean;
  className?: string;
}

export function AdSenseBanner({
  adSlot,
  adFormat = "auto",
  fullWidth = true,
  className = "",
}: AdSenseBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adsenseId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [adsenseId]);

  // AdSense ID가 설정되지 않았으면 플레이스홀더 표시
  if (!adsenseId) {
    return (
      <div
        className={`bg-[var(--border)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] text-sm ${className}`}
        style={{ minHeight: "250px" }}
      >
        광고 영역 (AdSense ID 필요)
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidth.toString()}
      />
    </div>
  );
}
