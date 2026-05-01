"use client";

import { useEffect } from "react";

export default function AdSense() {
  useEffect(() => {
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3651454000211352";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    window.addEventListener("scroll", load, { once: true, passive: true });
    window.addEventListener("click", load, { once: true });
    window.addEventListener("touchstart", load, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", load);
      window.removeEventListener("click", load);
      window.removeEventListener("touchstart", load);
    };
  }, []);
  return null;
}
