// components/Navbar.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, profile, logout } = useAuth();

  if(!user) {
    return null; // Don't render navbar if not logged in
  }
  return (
    <nav className="border-b bg-white p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-900">
          TritonScript 
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right text-sm">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role || "Loading..."}</p>
            </div>
          )}
          
          <button
            onClick={logout}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <LogOut className="inline-block mr-1 h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}