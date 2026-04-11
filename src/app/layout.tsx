import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow — Role-Based Task Management",
  description: "A modern role-based task management system for teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Prevent flash by hiding content until theme is applied */
          html:not(.theme-ready) body {
            visibility: hidden !important;
            opacity: 0 !important;
          }
          html.theme-ready body {
            visibility: visible !important;
            opacity: 1 !important;
          }
        `}} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get the current user ID from Zustand persist storage
                  const authData = localStorage.getItem('tm-auth-storage');
                  let userId = null;
                  
                  if (authData) {
                    try {
                      const parsed = JSON.parse(authData);
                      // Zustand persist wraps the state in a 'state' property
                      userId = parsed.state?.userId || null;
                    } catch (e) {}
                  }
                  
                  // Get the theme for the current user
                  const themeKey = userId ? 'theme:' + userId : 'theme:guest';
                  const theme = localStorage.getItem(themeKey);
                  
                  // Apply theme immediately
                  const root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                    root.style.backgroundColor = '#0f172a';
                  } else {
                    root.classList.remove('dark');
                    root.style.backgroundColor = '#ffffff';
                  }
                  
                  // Mark theme as ready
                  root.classList.add('theme-ready');
                } catch (e) {
                  // Default to light theme on error
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.backgroundColor = '#ffffff';
                  document.documentElement.classList.add('theme-ready');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#0f172a]">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
