// app/login/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react installed

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();

  // If already logged in, push to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            TritonScript
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Office for Students with Disabilities Note Sharing
          </p>
        </div>

        <button
          onClick={login}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
        >
          {/* Simple Google G Icon SVG */}
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 0.507 5.387 0 12s5.36 12 12 12c3.6 0 6.693-1.2 8.387-3.28 1.84-2.16 2.16-5.32 2.16-7.053 0-.52-.053-1.027-.147-1.507h-9.92z" />
          </svg>
          Sign in with Google
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          Only UCSD accounts are authorized for scribe access.
        </p>
      </div>
    </div>
  );
}