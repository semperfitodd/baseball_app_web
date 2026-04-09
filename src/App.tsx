import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { queryClient } from "@/config/query-client";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthCallback } from "@/pages/AuthCallback";
import { Home } from "@/pages/Home";
import { Leaderboard } from "@/pages/Leaderboard";
import { Login } from "@/pages/Login";
import { Play } from "@/pages/Play";
import { Profile } from "@/pages/Profile";
import { Progress } from "@/pages/Progress";

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function AuthenticatedLayout() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-20 md:pb-6">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </AuthGuard>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "auth/callback", element: <AuthCallback /> },
      {
        element: <AuthenticatedLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "play", element: <Play /> },
          { path: "progress", element: <Progress /> },
          { path: "leaderboard", element: <Leaderboard /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
