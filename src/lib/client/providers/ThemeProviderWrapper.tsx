"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeProvider>
  );
}
