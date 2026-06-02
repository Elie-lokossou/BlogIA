"use client";

import { useEffect } from "react";

// #region agent log — instrumentation temporaire (debug images)
const DEBUG_ENDPOINT = "http://127.0.0.1:7697/ingest/e6749389-c8ed-4c61-9934-97e283b6367a";

function sendDebug(message: string, data: unknown) {
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48c5a8" },
    body: JSON.stringify({
      sessionId: "48c5a8",
      location: "DebugImageProbe.tsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

export default function DebugImageProbe() {
  useEffect(() => {
    // #region agent log — sonde de chargement des images (navigateur)
    const classify = (img: HTMLImageElement) => {
      const src = img.currentSrc || img.src || "";
      const isOptimizer = src.includes("/_next/image");
      const ok = img.complete && img.naturalWidth > 0;
      return {
        kind: isOptimizer ? "next-image" : "raw-img",
        ok,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        src: src.slice(0, 140),
      };
    };

    const report = (phase: string) => {
      const imgs = Array.from(document.images);
      const details = imgs.map(classify);
      const broken = details.filter((d) => !d.ok);
      sendDebug("image-status", {
        hypothesis: "A/B/C/D",
        phase,
        path: location.pathname,
        total: imgs.length,
        loaded: imgs.length - broken.length,
        broken: broken.length,
        brokenByKind: {
          nextImage: broken.filter((b) => b.kind === "next-image").length,
          rawImg: broken.filter((b) => b.kind === "raw-img").length,
        },
        brokenSamples: broken.slice(0, 8),
      });
    };

    const onError = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.tagName === "IMG") {
        const img = t as HTMLImageElement;
        sendDebug("image-error-event", {
          hypothesis: "B",
          path: location.pathname,
          src: (img.currentSrc || img.src || "").slice(0, 140),
          kind: (img.currentSrc || img.src || "").includes("/_next/image") ? "next-image" : "raw-img",
        });
      }
    };

    document.addEventListener("error", onError, true);
    const t1 = window.setTimeout(() => report("t+3s"), 3000);
    const t2 = window.setTimeout(() => report("t+12s"), 12000);
    sendDebug("probe-mounted", { path: location.pathname, ua: navigator.userAgent.slice(0, 80) });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener("error", onError, true);
    };
    // #endregion
  }, []);

  return null;
}
