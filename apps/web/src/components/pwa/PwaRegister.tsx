"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Check for service worker updates periodically
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    console.log("Zavora Life PWA: Versi baru tersedia.");
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn("Zavora Life ServiceWorker registration skipped:", err);
          });
      });
    }
  }, []);

  return null;
}
